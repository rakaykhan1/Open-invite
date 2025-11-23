# Supabase Setup Guide

To enable syncing and user accounts, you need to create a free Supabase project.

## Step 1: Create Project
1.  Go to [supabase.com](https://supabase.com) and sign up/login.
2.  Click **"New Project"**.
3.  Give it a name (e.g., "Open Invite") and a password.
4.  Choose a region near you.
5.  Click **"Create new project"**.

## Step 2: Get API Keys
1.  Once the project is ready (takes ~1 min), go to **Project Settings** (cog icon) -> **API**.
2.  Copy the **Project URL**.
3.  Copy the **anon** / **public** key.
4.  Create a file named `.env` in your project root (next to `package.json`).
5.  Paste the keys like this:
    ```
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

## Step 3: Setup Database
1.  Go to the **SQL Editor** (icon on the left bar).
2.  Click **"New query"**.
3.  Open the file `supabase_schema.sql` in your code editor, copy ALL the text.
4.  Paste it into the Supabase SQL Editor.
5.  Click **"Run"**.

## Step 4: Restart App
1.  Stop your local server (Ctrl+C).
2.  Run `npm run host` again.
