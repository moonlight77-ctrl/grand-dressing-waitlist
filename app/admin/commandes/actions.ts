'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';
import { orderConfirmationEmail } from '@/lib/emails/templates';

// 1. Déclaration du client "Super-Admin" pour contourner le RLS
function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const resend = new Resend(process.env.RESEND_API_KEY);

export type OrderFormData = {
  delivery_type: 'delivery' | 'pickup';
  first_name: string;
  last_name: string;
  phone: string;
  address_line1?: string;
  address_line2?: string;
  postal_code?: string;
  city?: string;
  pickup_slot?: string;
  note?: string;
};

export type CartItem = {
  id: string;
  name: string;
  brand: string;
  image_url: string | null;
  capacity_cost: number;
  sizes: string[];
  selectedSize?: string;
};

// ==========================================
// CREATION D'UNE COMMANDE (Côté Utilisatrice)
// ==========================================
export async function submitOrder(formData: OrderFormData, cartItems: CartItem[]) {
  const supabase = await createClient();
  const serviceClient = getServiceClient();

  // 1. Session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, message: 'Non authentifiée.' };

  // 2. Profil via service role (bypass RLS)
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('style_points_total, style_points_used')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) return { success: false, message: 'Profil introuvable.' };

  const totalCost = cartItems.reduce((sum, item) => sum + (item.capacity_cost || 0), 0);
  const available = profile.style_points_total - profile.style_points_used;
  if (totalCost > available) {
    return { success: false, message: `Capacité insuffisante (${totalCost}/${available} pts disponibles).` };
  }

  // 3. Validation livraison
  if (formData.delivery_type === 'delivery' && (!formData.address_line1 || !formData.postal_code || !formData.city)) {
    return { success: false, message: 'Adresse incomplète.' };
  }
  if (formData.delivery_type === 'pickup' && !formData.pickup_slot) {
    return { success: false, message: 'Veuillez choisir un créneau de remise.' };
  }

  // 4. Créer la commande
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: user.id,
      items: cartItems,
      total_capacity_cost: totalCost,
      status: 'pending',
      delivery_type: formData.delivery_type,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone || null,
      address_line1: formData.address_line1 || null,
      address_line2: formData.address_line2 || null,
      postal_code: formData.postal_code || null,
      city: formData.city || null,
      pickup_slot: formData.pickup_slot || null,
      note: formData.note || null,
    }])
    .select('id')
    .single();

  if (orderError) {
    console.error('Order error:', orderError);
    return { success: false, message: 'Erreur lors de la création de la commande.' };
  }

  // 5. Mettre à jour les points
  await serviceClient
    .from('profiles')
    .update({ style_points_used: profile.style_points_used + totalCost })
    .eq('id', user.id);

  // 6. Email de confirmation commande
  try {
    await resend.emails.send({
      from: 'Gradora <contact@gradora.fr>',
      to: user.email!,
      subject: `Votre dressing est confirmé · Réf. ${order.id.slice(0, 8).toUpperCase()}`,
      html: orderConfirmationEmail({
        first_name: formData.first_name,
        id: order.id,
        delivery_type: formData.delivery_type,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        postal_code: formData.postal_code,
        city: formData.city,
        pickup_slot: formData.pickup_slot,
        total_capacity_cost: totalCost,
        items: cartItems,
      }),
    });
  } catch (emailErr) {
    console.error('Email confirmation error:', emailErr);
  }

  revalidatePath('/mon-dressing');
  revalidatePath('/panier');
  return { success: true, orderId: order.id };
}

// ==========================================
// LECTURE DES COMMANDES (Côté Admin)
// ==========================================
export async function getOrders() {
  const serviceClient = getServiceClient(); // Utilise le super-admin pour tout voir
  
  const { data, error } = await serviceClient
    .from('orders')
    .select(`*, profiles(full_name, avatar_url)`)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Erreur getOrders:", error);
    return [];
  }
  return data;
}

// ==========================================
// MISE A JOUR DES COMMANDES (Côté Admin)
// ==========================================
export async function updateOrderStatus(
  orderId: string,
  status: 'confirmed' | 'shipped' | 'active' | 'returned' | 'cancelled'
) {
  const serviceClient = getServiceClient(); // Utilise le super-admin pour forcer la mise à jour

  const timestampField: Record<string, string> = {
    confirmed: 'confirmed_at',
    shipped:   'shipped_at',
    returned:  'returned_at',
  };

  const updates: Record<string, unknown> = { status };
  if (timestampField[status]) {
    updates[timestampField[status]] = new Date().toISOString();
  }

  // Si retour → libérer les points
  if (status === 'returned') {
    const { data: order } = await serviceClient
      .from('orders')
      .select('user_id, total_capacity_cost')
      .eq('id', orderId)
      .single();

    if (order) {
      const { data: profile } = await serviceClient
        .from('profiles')
        .select('style_points_used')
        .eq('id', order.user_id)
        .single();

      if (profile) {
        await serviceClient
          .from('profiles')
          .update({
            style_points_used: Math.max(0, profile.style_points_used - order.total_capacity_cost),
          })
          .eq('id', order.user_id);
      }
    }
  }

  const { error } = await serviceClient
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) {
    console.error("Erreur lors de la mise à jour de la commande :", error);
    return { success: false };
  }
  
  revalidatePath('/admin/commandes');
  return { success: true };
}