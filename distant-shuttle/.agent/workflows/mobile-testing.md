---
description: How to test the app on your mobile phone
---

1. **Connect to Wi-Fi**: Ensure both your laptop and your phone are connected to the **same Wi-Fi network**.

2. **Run the Host Command**:
   In your terminal, run the following command to start the server in network mode:
   ```bash
   npm run host
   ```

3. **Find the Network URL**:
   Look at the terminal output. You will see something like:
   ```
     ➜  Local:   http://localhost:5173/
     ➜  Network: http://192.168.1.5:5173/
   ```
   Note the **Network** URL (the one with numbers).

4. **Open on Phone**:
   Open your phone's web browser (Safari or Chrome) and type in that exact Network URL.

> [!NOTE]
> If the page doesn't load, check your Windows Firewall settings. You might need to allow "Node.js" to access private networks.
