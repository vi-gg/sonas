import { signup } from "./actions";

export default function SignupPage() {
  return (
    <>
      <div className="w-screen h-screen flex">
        <div className="w-full h-full p-4">
          <div className="w-full h-full rounded-2xl bg-gray-200" />
        </div>
        <div className="w-full h-full flex items-center gap-0 justify-center">
          <form className="border rounded-lg p-8 w-[22rem]" action={signup}>
            <div className="flex flex-col items-center gap-2 text-center mb-4">
              <h1 className="text-2xl font-bold">Signup</h1>
            </div>
            <div className="grid gap-5">
              {/* We're keeping only email and password fields as requested */}
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <label htmlFor="password">Password</label>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="******"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                Sign up
              </button>
              <label htmlFor="email" className="text-xs">
                Already have an account? Login here
              </label>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
