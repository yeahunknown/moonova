import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationData {
  transactionSignature: string;
  amount: number;
  type: 'token' | 'liquidity';
  tokenData?: any;
  userAgent?: string;
  ipAddress?: string;
  timestamp: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[TELEGRAM-NOTIFY] ${step}${detailsStr}`);
};

async function getLocationFromIP(ip: string): Promise<string> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    if (data.status === 'success') {
      return `${data.city}, ${data.regionName}, ${data.country} (${data.countryCode})`;
    }
  } catch (error) {
    logStep('Location lookup failed', { error: error.message });
  }
  return 'Unknown';
}

async function sendTelegramMessage(message: string) {
  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const chatId = '6551208881';
  
  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured');
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const response = await fetch(telegramUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }

  return response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Telegram notification function started');

    const notificationData: NotificationData = await req.json();
    const {
      transactionSignature,
      amount,
      type,
      tokenData,
      userAgent,
      ipAddress,
      timestamp
    } = notificationData;

    logStep('Processing notification', { type, amount, signature: transactionSignature });

    // Get location info if IP is available
    let location = 'Unknown';
    if (ipAddress && ipAddress !== '::1' && !ipAddress.startsWith('192.168.')) {
      location = await getLocationFromIP(ipAddress);
    }

    // Format the timestamp
    const formattedTime = new Date(timestamp).toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Create detailed message
    const paymentType = type === 'token' ? 'Token Creation' : 'Liquidity Addition';
    const amountUSD = (amount / 100).toFixed(2); // Convert from cents
    
    let message = `🚀 <b>MOONOVA PAYMENT ALERT</b> 🚀\n\n`;
    message += `💰 <b>Type:</b> ${paymentType}\n`;
    message += `💵 <b>Amount:</b> $${amountUSD} USD\n`;
    message += `🔗 <b>Transaction:</b> <code>${transactionSignature}</code>\n`;
    message += `🕐 <b>Time:</b> ${formattedTime} UTC\n`;
    message += `🌍 <b>Location:</b> ${location}\n`;
    
    if (userAgent) {
      // Extract browser and OS info
      const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/);
      const osMatch = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/);
      const browser = browserMatch ? browserMatch[0] : 'Unknown Browser';
      const os = osMatch ? osMatch[0] : 'Unknown OS';
      message += `💻 <b>Device:</b> ${browser} on ${os}\n`;
    }
    
    if (ipAddress) {
      message += `🔍 <b>IP Address:</b> <code>${ipAddress}</code>\n`;
    }

    if (tokenData && type === 'token') {
      message += `\n📊 <b>Token Details:</b>\n`;
      if (tokenData.name) message += `• Name: ${tokenData.name}\n`;
      if (tokenData.symbol) message += `• Symbol: ${tokenData.symbol}\n`;
      if (tokenData.supply) message += `• Supply: ${tokenData.supply}\n`;
    }

    message += `\n🔒 <b>Security Status:</b> ✅ Verified Payment`;
    message += `\n\n🔗 <b>Solscan:</b> https://solscan.io/tx/${transactionSignature}`;

    // Send to Telegram
    await sendTelegramMessage(message);
    
    logStep('Telegram notification sent successfully');

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERROR in telegram notification', { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});