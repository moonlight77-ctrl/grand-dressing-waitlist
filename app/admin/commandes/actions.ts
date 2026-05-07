'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(
  orderId: string,
  status: 'confirmed' | 'shipped' | 'active' | 'returned' | 'cancelled'
) {
  const supabase = await createClient();

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
    const { data: order } = await supabase
      .from('orders')
      .select('user_id, total_capacity_cost')
      .eq('id', orderId)
      .single();

    if (order) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('style_points_used')
        .eq('id', order.user_id)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            style_points_used: Math.max(0, profile.style_points_used - order.total_capacity_cost),
          })
          .eq('id', order.user_id);
      }
    }
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) return { success: false };
  revalidatePath('/admin/commandes');
  return { success: true };
}