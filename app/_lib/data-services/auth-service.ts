// Safe for client components - only uses browser Supabase client
import { supabase } from "../supabase/client";

export async function signUp({
  email,
  password,
  fullName,
  role,
  storeName,
  storeDescription,
}: any) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role } },
  });

  if (authError) throw new Error(authError.message);

  if (authData.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: authData.user.id, full_name: fullName, role }]);
    if (profileError) throw new Error(profileError.message);

    if (role === "guest" && storeName) {
      const { error: storeError } = await supabase.from("stores").insert([
        {
          owner_id: authData.user.id,
          name: storeName,
          slug: storeName.toLowerCase().replace(/ /g, "-"),
          description: storeDescription,
          is_active: false,
        },
      ]);
      if (storeError) throw new Error(storeError.message);
    }
  }
  return authData;
}

export async function signIn({ email, password }: any) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
