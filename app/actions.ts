'use server';

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// 1. Initialisation des clients (Sécurisé côté serveur)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

// 2. La fonction principale appelée par le formulaire
export async function joinWaitlist(formData: FormData, referredByCode: string | null) {
  const email = formData.get('email') as string;

  if (!email) return { error: "L'email est requis" };

  // Génération d'un code unique (ex: JUL839)
  const code = (email.substring(0, 3) + Math.random().toString(36).substring(2, 5)).toUpperCase();

  try {
    // A. Sauvegarder dans Supabase
    const { error: dbError } = await supabase
      .from('waitlist')
      .insert({
        email: email,
        referral_code: code,
        referred_by: referredByCode || null, // On enregistre le parrain si présent
      });

    if (dbError) {
      // Gestion des doublons
      if (dbError.code === '23505') {
        return { error: "Vous êtes déjà inscrit(e) sur la liste !" };
      }
      console.error('Erreur Supabase:', dbError);
      return { error: "Une erreur technique est survenue." };
    }

    // B. Envoyer l'email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'GrandDressing <onboarding@resend.dev>', // Changez ceci une fois votre domaine validé sur Resend
      to: email,
      subject: 'Bienvenue sur la liste d\'attente GrandDressing',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0a0a0a; color: #f5f5f5; padding: 40px; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #171717; padding: 40px; border: 1px solid #333;">
            <h1 style="color: #fcd34d; font-weight: 300; letter-spacing: 2px; margin-bottom: 20px;">BIENVENUE</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #d4d4d4; margin-bottom: 30px;">
              Votre inscription est confirmée. Vous faites désormais partie du cercle GrandDressing.
            </p>
            
            <div style="background-color: #262626; padding: 20px; border: 1px solid #fcd34d; margin: 30px 0;">
              <p style="text-transform: uppercase; font-size: 12px; letter-spacing: 2px; color: #fcd34d; margin: 0 0 10px 0;">Votre lien d'invitation</p>
              <p style="font-size: 18px; color: #fff; margin: 0;">
                ${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}?ref=${code}
              </p>
            </div>

            <p style="font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 1px;">
              Invitez 3 amis pour obtenir un accès prioritaire.
            </p>
          </div>
        </div>
      `
    });

    if (emailError) {
      console.error('Erreur Resend:', emailError);
      // On ne retourne pas d'erreur à l'utilisateur car l'inscription en base a fonctionné
    }

    // C. Succès ! On renvoie le code au frontend pour l'afficher
    return { success: true, code: code };

  } catch (err) {
    console.error('Erreur globale:', err);
    return { error: "Une erreur inattendue est survenue." };
  }
}