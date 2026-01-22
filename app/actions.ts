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

    // --- Configuration des Liens ---
    const surveyLink = "https://tally.so/r/GxRz5O"; // Votre lien Tally officiel
    const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://gradora.fr'; // Lien de base pour le parrainage

    // B. Envoyer l'email via Resend
    const { error: emailError } = await resend.emails.send({
      // IMPORTANT : Utilisez 'contact@gradora.fr' OU 'contact@send.gradora.fr' selon votre validation Resend
      from: 'Gradora <contact@gradora.fr>', 
      to: email,
      subject: 'Bienvenue dans la waitlist ✨',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0a0a0a; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; background-color: #171717; color: #e5e5e5; }
              .header { padding: 40px; text-align: center; border-bottom: 1px solid #333; }
              .content { padding: 40px 30px; line-height: 1.6; color: #d4d4d4; }
              .gold-text { color: #fcd34d; }
              .btn { display: inline-block; background-color: #fcd34d; color: #000000; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 2px; margin: 25px 0; letter-spacing: 1px; font-size: 14px; }
              .referral-box { background-color: #262626; padding: 25px; border: 1px solid #fcd34d; margin-top: 40px; text-align: center; }
              .referral-link { font-size: 16px; color: #fff; font-weight: bold; margin: 10px 0 0 0; word-break: break-all; text-decoration: none; display: block; }
              .footer { padding: 30px; text-align: center; font-size: 12px; color: #737373; background-color: #0a0a0a; }
            </style>
          </head>
          <body>
            <div class="container">
              
              <div class="header">
                <h1 style="margin:0; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; font-size: 24px; color: #f5f5f5;">Gradora</h1>
              </div>

              <div class="content">
                <h2 style="font-weight: 300; color: #fff; margin-top: 0; font-size: 22px;">Bienvenue dans le cercle.</h2>
                
                <p>Votre inscription est confirmée. Vous faites désormais partie des privilégiés qui accéderont prochainement à la garde-robe infinie.</p>
                
                <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;">

                <h3 class="gold-text" style="font-weight: 400; font-size: 18px; margin-bottom: 10px;">🎯 Votre style, notre priorité</h3>
                <p style="margin-top: 0;">Pour préparer le lancement et vous proposer des pièces qui vous correspondent vraiment, nous avons besoin de mieux vous connaître.</p>
                <p>Cela prend <strong>moins d'une minute</strong> et influence directement la sélection disponible au jour J.</p>
                
                <div style="text-align: center;">
                  <a href="${surveyLink}" class="btn">PERSONNALISER MA SÉLECTION</a>
                </div>

                <div class="referral-box">
                  <p style="text-transform: uppercase; font-size: 11px; letter-spacing: 2px; color: #fcd34d; margin: 0 0 15px 0;">Accès Prioritaire</p>
                  <p style="font-size: 14px; margin: 0; color: #d4d4d4;">Invitez vos amis pour monter dans la liste :</p>
                  <a href="${siteUrl}?ref=${code}" class="referral-link">
                    ${siteUrl}?ref=${code}
                  </a>
                </div>
              </div>

              <div class="footer">
                <p>Gradora · Paris</p>
                <p style="margin-top: 10px; opacity: 0.6;">Vous recevez cet email car vous avez rejoint la liste d'attente.</p>
              </div>

            </div>
          </body>
        </html>
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