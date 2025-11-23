# How to Deploy "Open Invite"

To share this app with your friends, you need to deploy it to the internet. We recommend **Vercel** (it's free and easy).

## Step 1: Push to GitHub
1.  Create a new repository on [GitHub](https://github.com).
2.  Run these commands in your terminal (VS Code):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin main
    ```

## Step 2: Deploy on Vercel
1.  Go to [vercel.com](https://vercel.com) and sign up/login.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **IMPORTANT:** In the "Environment Variables" section, add your Supabase keys:
    *   `VITE_SUPABASE_URL`: (Your URL)
    *   `VITE_SUPABASE_ANON_KEY`: (Your Key)
5.  Click **"Deploy"**.

## Step 3: Install on Phone
1.  Once deployed, send the link to your phone.
2.  Open it in Chrome (Android) or Safari (iOS).
3.  **Android:** Tap "Install Open Invite" or "Add to Home Screen".
4.  **iOS:** Tap Share button -> "Add to Home Screen".

Now you have a real working app!
