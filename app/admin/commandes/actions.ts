'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServiceClient } from '@supabase/supabase-js';
function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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