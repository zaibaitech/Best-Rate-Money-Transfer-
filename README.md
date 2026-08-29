# Best Rate — Version 1

Mobile web page for UK → Gambia **local transfer** requests.

It does **not** take card payments or hold money.  
It calculates the rate, collects pickup details, then opens WhatsApp with a ready message.

## What the customer does

1. Opens the site on their phone (Android or iPhone).
2. Types the pound amount — sees dalasi instantly.
3. Enters receiver name, phone and pickup point.
4. Taps **WhatsApp this request**.
5. Pays **UNILINX LIMITED** from their UK bank.
6. Optionally taps **I’ve paid** and sends the receipt in the same chat.

## Rates built in

- £1 – £1,000 → 94 GMD  
- £1,000 – £5,000 → 95 GMD  
- £5,000 – £10,000 → 96 GMD  
- £10,000 – £100,000 → 97 GMD  

WhatsApp number used: `+44 7745 596993` (`07745596993`).

## Put it on Vercel

1. Create a free account at [vercel.com](https://vercel.com) (GitHub login is easiest).
2. Push this folder to a GitHub repo, **or** on the Vercel dashboard choose **Add New… → Project → Upload**.
3. If uploading: zip the contents of `best-rate-app` (the files inside, including `index.html` at the top).
4. Framework preset: **Other**.
5. Click Deploy.

You will get a link such as `https://best-rate.vercel.app`.

Put that link:

- in your WhatsApp profile / status
- on Linktree as **Send money**
- under the flyer QR later if you want

### Custom domain (optional)

In Vercel → Project → Settings → Domains, add e.g. `bestrate.gm` or `send.yourdomain.com`.

## Add to home screen

On iPhone: Safari → Share → **Add to Home Screen**.  
On Android: Chrome → menu → **Add to Home screen**.  
It then opens like a small app. Still just this website.

## Change rates or locations later

Edit `js/app.js`:

- `rateFor()` for the bands  
- `locations` array  
- `WA_NUMBER` if the WhatsApp number changes  
- `account` if the bank details change  

Do not change the account name unless the bank account name itself changes.

## What this is not

Not a licensed payments app. No Stripe, Razorpay, wallets or automatic Gambia payout.
