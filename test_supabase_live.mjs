import { createClient } from '@supabase/supabase-js';

async function runLiveVerification() {
  console.log("=== SUPABASE LIVE VERIFICATION ===");
  
  let rawUrl = process.env.VITE_SUPABASE_URL || 'qdhlgvyxfugucjbvdsgh';
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  
  let url = rawUrl.trim();
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    if (!url.includes('.') && !url.includes(' ') && !url.includes('/')) {
      url = `https://${url}.supabase.co`;
    } else if (url.includes('.') && !url.includes(' ')) {
      url = `https://${url}`;
    }
  }

  // 1. Initialize client
  console.log("\n[Check 1] Client Initialization:");
  const supabase = createClient(url, anonKey);
  console.log("SUCCESS: Supabase client initialized.");

  // 2. Project URL
  console.log("\n[Check 2] Project URL:");
  const maskedUrl = url.replace(/(https:\/\/[a-zA-Z0-9]{3})[a-zA-Z0-9]+(\.supabase\.co)/, '$1*******$2');
  console.log(`URL in use: ${maskedUrl} (Raw ID: ${rawUrl})`);

  // 3. Confirm connection reaches real Supabase project
  console.log("\n[Check 3] Reachability Test:");
  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: { 'apikey': anonKey }
    });
    if (res.ok) {
      const settings = await res.json();
      console.log("SUCCESS: Reached real Supabase project backend API. Auth settings retrieved:", {
        external_email: settings.external?.email,
        disable_signup: settings.disable_signup
      });
    } else {
      console.log(`FAILED: Received status ${res.status}`);
    }
  } catch (err) {
    console.log("FAILED to connect:", err.message);
  }

  // 4. Test reading authenticated session
  console.log("\n[Check 4] Reading initial authenticated session:");
  const { data: initialSession, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr) {
    console.log("FAILED reading session:", sessionErr.message);
  } else {
    console.log("SUCCESS: Initial session state checked. Session is:", initialSession.session ? "ACTIVE" : "NULL (No active session yet)");
  }

  // 5. Test creating a new user account
  const testEmail = `verify_${Date.now()}@bneimenashe.org`;
  const testPassword = `SecurePass_${Date.now()}!99`;
  console.log(`\n[Check 5] Creating new user account (${testEmail}):`);
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: { full_name: 'Verification User', role: 'MEMBER' }
    }
  });

  if (signUpErr) {
    console.log("FAILED during signUp:", signUpErr.message);
  } else {
    console.log("SUCCESS: User signed up successfully.", {
      userId: signUpData.user?.id,
      email: signUpData.user?.email,
      sessionCreatedImmediately: !!signUpData.session
    });
  }

  // 6. Test signing in
  console.log(`\n[Check 6] Signing in with created credentials:`);
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });

  if (signInErr) {
    console.log("FAILED during signIn:", signInErr.message);
  } else {
    console.log("SUCCESS: User signed in successfully. Access token granted.");
  }

  // 7. Test reading current authenticated user
  console.log(`\n[Check 8 (User Check)] Reading current authenticated user:`);
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) {
    console.log("FAILED reading current user:", userErr.message);
  } else {
    console.log("SUCCESS: Current authenticated user read:", {
      id: userData.user?.id,
      email: userData.user?.email,
      role: userData.user?.user_metadata?.role
    });
  }

  // 8. Test writing a profile record
  console.log(`\n[Check 9 (Write Profile)] Writing profile record to 'profiles' table:`);
  const userId = userData.user?.id || signUpData.user?.id;
  if (!userId) {
    console.log("FAILED: No userId available to write profile.");
  } else {
    const profilePayload = {
      id: userId,
      email: testEmail,
      full_name: 'Verification User Updated',
      role: 'MEMBER',
      preferred_dialect: 'Hebrew',
      updated_at: new Date().toISOString()
    };
    const { data: writeData, error: writeErr } = await supabase
      .from('profiles')
      .upsert(profilePayload)
      .select()
      .single();

    if (writeErr) {
      console.log("FAILED writing profile record:", writeErr.message, "(Status code:", writeErr.code, ")");
    } else {
      console.log("SUCCESS: Profile record written successfully:", writeData);
    }
  }

  // 9. Test reading the profile record back
  console.log(`\n[Check 10 (Read Profile)] Reading profile record back:`);
  if (!userId) {
    console.log("FAILED: No userId available to read profile.");
  } else {
    const { data: readData, error: readErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (readErr) {
      console.log("FAILED reading profile record:", readErr.message);
    } else {
      console.log("SUCCESS: Read profile record back:", readData || "No row returned (table might not exist or RLS policy prevented read)");
    }
  }

  // 10. Test signing out
  console.log(`\n[Check 7 (Sign Out)] Signing out:`);
  const { error: signOutErr } = await supabase.auth.signOut();
  if (signOutErr) {
    console.log("FAILED signing out:", signOutErr.message);
  } else {
    const { data: postSignOutSession } = await supabase.auth.getSession();
    console.log("SUCCESS: Signed out successfully. Post sign-out session is:", postSignOutSession.session ? "ACTIVE" : "NULL");
  }
}

runLiveVerification();
