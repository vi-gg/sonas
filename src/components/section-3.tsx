import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Section3() {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-full h-full p-4">
        <div className="w-full h-full rounded-2xl bg-gray-200" />
      </div>
      <div className="w-full h-full flex items-center gap-0 justify-center">
        <form className="border rounded-lg p-8 w-[22rem]">
          <div className="flex flex-col items-center gap-2 text-center mb-4">
            <h1 className="text-2xl font-bold">Login</h1>
          </div>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required placeholder="******" />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Label htmlFor="email" className="text-xs">
              Forgot password? Rest here
            </Label>
          </div>
        </form>
      </div>
    </div>
  );
}
