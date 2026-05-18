// lib/emails/templates.ts
// Templates email Gradora — style éditorial dark

export function signupConfirmationEmail(confirmUrl: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez Gradora</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="padding:0 0 40px 0;text-align:center;border-bottom:1px solid #262626;">
              <p style="margin:0;font-size:11px;letter-spacing:8px;text-transform:uppercase;color:#737373;font-weight:400;">
                G · R · A · D · O · R · A
              </p>
            </td>
          </tr>

          <!-- LIGNE AMBER DÉCO -->
          <tr>
            <td style="padding:0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48" style="background-color:#fbbf24;height:1px;font-size:0;line-height:0;">&nbsp;</td>
                  <td style="height:1px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td style="padding:48px 0 40px 0;background-color:#111111;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 40px;">
                    <p style="margin:0 0 8px 0;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#fbbf24;font-weight:400;">
                      Accès accordé
                    </p>
                    <h1 style="margin:0 0 24px 0;font-size:32px;font-weight:200;color:#f5f5f5;letter-spacing:4px;text-transform:uppercase;line-height:1.2;">
                      Bienvenue<br>dans la famille.
                    </h1>
                    <p style="margin:0;font-size:13px;color:#a3a3a3;line-height:1.8;font-weight:300;">
                      Votre compte ambassadrice a été créé. Une dernière étape pour accéder à votre dressing — confirmez votre adresse email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0;background-color:#111111;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 40px 48px 40px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#ffffff;">
                          <a href="${confirmUrl}" style="display:inline-block;padding:16px 40px;background-color:#ffffff;color:#0a0a0a;text-decoration:none;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;">
                            CONFIRMER MON EMAIL
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:16px 0 0 0;font-size:10px;color:#525252;letter-spacing:1px;">
                      Ce lien expire dans 24 heures.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SÉPARATEUR -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:1px;background-color:#1f1f1f;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CE QUI VOUS ATTEND -->
          <tr>
            <td style="padding:40px 40px;background-color:#0d0d0d;">
              <p style="margin:0 0 24px 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#fbbf24;font-weight:400;">
                Ce qui vous attend
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 16px 0;vertical-align:top;width:24px;">
                    <div style="width:4px;height:4px;background-color:#fbbf24;margin-top:6px;">&nbsp;</div>
                  </td>
                  <td style="padding:0 0 16px 16px;">
                    <p style="margin:0;font-size:12px;color:#d4d4d4;line-height:1.6;font-weight:300;">
                      <strong style="color:#f5f5f5;font-weight:500;">50 points de dressing offerts</strong> pour votre premier mois
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 16px 0;vertical-align:top;width:24px;">
                    <div style="width:4px;height:4px;background-color:#fbbf24;margin-top:6px;">&nbsp;</div>
                  </td>
                  <td style="padding:0 0 16px 16px;">
                    <p style="margin:0;font-size:12px;color:#d4d4d4;line-height:1.6;font-weight:300;">
                      <strong style="color:#f5f5f5;font-weight:500;">Catalogue premium</strong> — pièces sélectionnées pour leur caractère
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;vertical-align:top;width:24px;">
                    <div style="width:4px;height:4px;background-color:#fbbf24;margin-top:6px;">&nbsp;</div>
                  </td>
                  <td style="padding:0 0 0 16px;">
                    <p style="margin:0;font-size:12px;color:#d4d4d4;line-height:1.6;font-weight:300;">
                      <strong style="color:#f5f5f5;font-weight:500;">Pressing inclus</strong> à chaque retour · Livraison offerte
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:32px 40px;border-top:1px solid #1f1f1f;">
              <p style="margin:0 0 8px 0;font-size:10px;color:#404040;letter-spacing:2px;text-transform:uppercase;">
                Gradora · Paris
              </p>
              <p style="margin:0;font-size:11px;color:#404040;line-height:1.6;">
                Si vous n'avez pas créé de compte, ignorez cet email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export function orderConfirmationEmail(order: {
  first_name: string;
  id: string;
  delivery_type: 'delivery' | 'pickup';
  address_line1?: string;
  address_line2?: string;
  postal_code?: string;
  city?: string;
  pickup_slot?: string;
  total_capacity_cost: number;
  items: Array<{ name: string; brand: string; capacity_cost: number; image_url?: string | null }>;
}): string {
  const ref = order.id.slice(0, 8).toUpperCase();
  const itemsHtml = order.items.map((item) => `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid #1f1f1f;vertical-align:middle;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:middle;">
              <p style="margin:0 0 2px 0;font-size:9px;color:#fbbf24;letter-spacing:3px;text-transform:uppercase;">${item.brand}</p>
              <p style="margin:0;font-size:12px;color:#f5f5f5;letter-spacing:1px;text-transform:uppercase;font-weight:300;">${item.name}</p>
            </td>
            <td style="text-align:right;vertical-align:middle;white-space:nowrap;">
              <p style="margin:0;font-size:10px;color:#737373;letter-spacing:2px;">${item.capacity_cost} pts</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const deliveryHtml = order.delivery_type === 'delivery'
    ? `<p style="margin:0;font-size:12px;color:#d4d4d4;line-height:1.8;font-weight:300;">
        ${order.address_line1}${order.address_line2 ? `, ${order.address_line2}` : ''}<br>
        ${order.postal_code} ${order.city}
       </p>
       <p style="margin:8px 0 0 0;font-size:10px;color:#737373;letter-spacing:1px;">Livraison estimée 48–72h</p>`
    : `<p style="margin:0;font-size:12px;color:#d4d4d4;line-height:1.8;font-weight:300;">
        Remise en main propre · ${order.pickup_slot}
       </p>
       <p style="margin:8px 0 0 0;font-size:10px;color:#737373;letter-spacing:1px;">Zone Paris intra-muros · Adresse confirmée sous 24h</p>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre dressing est confirmé</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="padding:0 0 40px 0;text-align:center;border-bottom:1px solid #262626;">
              <p style="margin:0;font-size:11px;letter-spacing:8px;text-transform:uppercase;color:#737373;font-weight:400;">
                G · R · A · D · O · R · A
              </p>
            </td>
          </tr>

          <!-- LIGNE AMBER -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48" style="background-color:#fbbf24;height:1px;font-size:0;line-height:0;">&nbsp;</td>
                  <td style="height:1px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td style="padding:48px 40px 40px;background-color:#111111;">
              <p style="margin:0 0 8px 0;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#fbbf24;font-weight:400;">
                Prêt confirmé
              </p>
              <h1 style="margin:0 0 16px 0;font-size:28px;font-weight:200;color:#f5f5f5;letter-spacing:3px;text-transform:uppercase;line-height:1.3;">
                C'est lancé,<br>${order.first_name} !
              </h1>
              <p style="margin:0;font-size:13px;color:#a3a3a3;line-height:1.8;font-weight:300;">
                Votre sélection a bien été enregistrée. Nous préparons votre dressing.
              </p>
              <p style="margin:16px 0 0 0;font-size:10px;color:#525252;letter-spacing:2px;text-transform:uppercase;">
                Réf. <span style="color:#737373;">${ref}</span>
              </p>
            </td>
          </tr>

          <!-- PIÈCES -->
          <tr>
            <td style="padding:0 40px;background-color:#111111;">
              <p style="margin:0 0 8px 0;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#fbbf24;">
                Votre sélection
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
                <!-- TOTAL -->
                <tr>
                  <td style="padding:16px 0 0 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:10px;color:#525252;letter-spacing:2px;text-transform:uppercase;">
                          Capacité utilisée
                        </td>
                        <td style="text-align:right;font-size:12px;color:#fbbf24;letter-spacing:2px;font-weight:500;">
                          ${order.total_capacity_cost} / 50 pts
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- LIVRAISON -->
          <tr>
            <td style="padding:32px 40px;background-color:#0d0d0d;border-top:1px solid #1f1f1f;border-bottom:1px solid #1f1f1f;">
              <p style="margin:0 0 12px 0;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#fbbf24;">
                ${order.delivery_type === 'delivery' ? '📦 Livraison' : '🤝 Remise en main propre'}
              </p>
              ${deliveryHtml}
            </td>
          </tr>

          <!-- RAPPELS -->
          <tr>
            <td style="padding:32px 40px;background-color:#0a0a0a;">
              <p style="margin:0 0 20px 0;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#525252;">
                À retenir
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 12px 0;vertical-align:top;width:16px;">
                    <div style="width:3px;height:3px;background-color:#fbbf24;margin-top:5px;">&nbsp;</div>
                  </td>
                  <td style="padding:0 0 12px 12px;">
                    <p style="margin:0;font-size:11px;color:#737373;line-height:1.6;">Durée du prêt : <span style="color:#a3a3a3;">1 mois</span></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px 0;vertical-align:top;">
                    <div style="width:3px;height:3px;background-color:#fbbf24;margin-top:5px;">&nbsp;</div>
                  </td>
                  <td style="padding:0 0 12px 12px;">
                    <p style="margin:0;font-size:11px;color:#737373;line-height:1.6;">Ne pas laver soi-même — <span style="color:#a3a3a3;">pressing inclus au retour</span></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;vertical-align:top;">
                    <div style="width:3px;height:3px;background-color:#fbbf24;margin-top:5px;">&nbsp;</div>
                  </td>
                  <td style="padding:0 0 0 12px;">
                    <p style="margin:0;font-size:11px;color:#737373;line-height:1.6;">Conserver le packaging d'origine</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:32px 40px;border-top:1px solid #1f1f1f;">
              <p style="margin:0 0 8px 0;font-size:10px;color:#404040;letter-spacing:2px;text-transform:uppercase;">
                Gradora · Paris
              </p>
              <p style="margin:0;font-size:11px;color:#404040;line-height:1.6;">
                Questions ? Répondez à cet email ou contactez-nous sur Instagram.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
