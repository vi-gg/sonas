import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Section4() {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-full h-full p-4">
        <div className="w-full h-full rounded-2xl bg-gray-200" />
      </div>
      <div className="w-full h-full flex items-center gap-0 justify-center">
        <form className="border rounded-lg p-8 w-[22rem]">
          <div className="flex flex-col items-center gap-2 text-center mb-4">
            <h1 className="text-2xl font-bold">Signup</h1>
          </div>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Name</Label>
              <Input id="email" type="email" required placeholder="Name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Organization Name</Label>
              <Input id="email" type="text" required placeholder="Acme Inc." />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required placeholder="******" />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Retype Password</Label>
              </div>
              <Input id="password" type="password" required placeholder="******" />
            </div>
            <Button type="submit" className="w-full">
              Sign up
            </Button>
            <Label htmlFor="email" className="text-xs">
              Already have an account? Login here
            </Label>
          </div>
        </form>
      </div>
    </div>
  );
}
