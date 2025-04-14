# Authentication Flow Diagram

## Current Authentication Flow (Client-Side)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant ClientComponent as New Simulation (Client Component)
    participant SupabaseClient as Supabase Client
    participant SupabaseAuth as Supabase Auth

    User->>Browser: Navigate to /new-simulation
    Browser->>ClientComponent: Load component
    ClientComponent->>SupabaseClient: createClient()
    ClientComponent->>SupabaseAuth: getUser()
    SupabaseAuth-->>ClientComponent: Return user data

    alt No authenticated user
        ClientComponent->>Browser: Redirect to /login
        Browser->>User: Show login page
    else Authenticated user
        ClientComponent->>User: Show simulation form
    end
```

## New Authentication Flow (Server-Side)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant ServerComponent as New Simulation (Server Component)
    participant ClientComponent as New Simulation Client (Client Component)
    participant SupabaseServer as Supabase Server
    participant SupabaseAuth as Supabase Auth

    User->>Browser: Navigate to /new-simulation
    Browser->>ServerComponent: Request page
    ServerComponent->>SupabaseServer: createClient()
    ServerComponent->>SupabaseAuth: getUser()
    SupabaseAuth-->>ServerComponent: Return user data

    alt No authenticated user
        ServerComponent->>Browser: Redirect to /login
        Browser->>User: Show login page
    else Authenticated user
        ServerComponent->>ClientComponent: Render client component
        ClientComponent->>Browser: Return HTML/JS
        Browser->>User: Show simulation form
    end
```

## Component Structure

```mermaid
graph TD
    A[Browser Request] --> B[Server Component: page.tsx]
    B -->|Authentication Check| C{User Authenticated?}
    C -->|No| D[Redirect to /login]
    C -->|Yes| E[Render Client Component]
    E --> F[Client Component: new-simulation-client.tsx]
    F --> G[Render Simulation Form]
    G --> H[Handle Form State & Submission]
```

## File Structure

```
src/app/new-simulation/
├── page.tsx                  # Server component that checks auth
└── new-simulation-client.tsx # Client component with form logic
```

## Authentication Check Comparison

### Before (Client-Side)

```tsx
// In page.tsx (client component)
useEffect(() => {
  const checkAuth = async () => {
    const supabase = createClient(); // Client-side Supabase
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      router.push("/login");
    }
  };

  checkAuth();
}, [router]);
```

### After (Server-Side)

```tsx
// In page.tsx (server component)
const supabase = await createClient(); // Server-side Supabase
const { data, error } = await supabase.auth.getUser();

if (error || !data?.user) {
  redirect("/login");
}

return <NewSimulationClient />;
```
