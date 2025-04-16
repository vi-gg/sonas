import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Section5() {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-full h-full p-4">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/login2.png')" }}
        />
      </div>
      <div className="w-full h-full flex items-center gap-0 justify-center">
        <form className="border rounded-lg p-8 w-[22rem]">
          <div className="flex flex-col items-center text-center mb-4">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
          </div>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>
            <Button type="submit" className="w-full">
              Send rest email
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
