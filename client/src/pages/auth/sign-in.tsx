import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Logo from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const underlineInputClassName = cn(
  "h-11 rounded-none border-0 border-b border-b-neutral-300 bg-transparent px-0 py-2 shadow-none",
  "text-base md:text-sm",
  "placeholder:text-muted-foreground/80",
  "focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-b-primary",
  "aria-invalid:border-b-2 aria-invalid:border-b-destructive",
);

const demoAccounts = [
  { email: "user1@gmail.com", password: "123456aA@" },
  { email: "user2@gmail.com", password: "123456aA@" },
] as const;

/**
 * Large abstract brand mark: connected nodes and a lightning stroke for speed.
 * @returns SVG element for the sign-in brand panel.
 */
function BrandPanelMark() {
  return (
    <svg
      className="h-[4.5rem] w-[4.5rem] shrink-0 text-[#A78BFA] md:h-[6.25rem] md:w-[6.25rem] lg:h-28 lg:w-28"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M18 88C18 88 42 72 60 72C78 72 102 88 102 88"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M60 24V72M36 52L60 72L84 52"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
      <circle cx="60" cy="22" r="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="22" cy="92" r="8" fill="currentColor" opacity="0.85" />
      <circle cx="98" cy="92" r="8" fill="currentColor" opacity="0.85" />
      <path
        d="M58 44L48 68H56L52 88L72 60H62L66 44H58Z"
        fill="currentColor"
        opacity="0.95"
      />
    </svg>
  );
}

/**
 * Renders the sign-in route as a full-viewport split layout: brand panel and form column.
 * @returns The sign-in page element.
 */
const SignIn = () => {
  const { login, isLoggingIn } = useAuth();

  const formSchema = z.object({
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isLoggingIn) return;
    login(values);
  };

  return (
    <div className="box-border flex h-dvh min-h-dvh w-full max-w-[100vw] flex-col items-stretch overflow-hidden md:h-screen md:min-h-screen md:flex-row">
      <aside
        className="relative flex min-h-[min(44vh,360px)] shrink-0 flex-col overflow-hidden bg-[#6D28D9] px-8 py-10 md:h-full md:min-h-0 md:w-[55%] md:min-w-[50%] md:max-w-[60%] md:px-12 md:py-14 lg:px-16"
        aria-label="Brand"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6D28D9] via-[#5B21B6]/90 to-[#4C1D95]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -right-16 top-0 h-[min(55vw,420px)] w-[min(55vw,420px)] rounded-full bg-[#A78BFA]/12 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-white/[0.07] blur-3xl" />
          <div className="absolute left-1/2 top-1/3 h-64 w-96 -translate-x-1/2 rounded-[100%] border border-white/[0.09]" />
          <div className="absolute -left-8 top-24 h-52 w-72 rotate-[8deg] rounded-[2.5rem] border border-white/[0.11]" />
          <div className="absolute right-0 top-1/2 h-72 w-56 -translate-y-1/2 rotate-[-14deg] rounded-[2rem] border border-white/[0.08]" />
          <div className="absolute bottom-16 left-[12%] h-40 w-64 rotate-3 rounded-3xl border border-[#A78BFA]/15" />
          <svg
            className="absolute -bottom-8 left-1/2 w-[140%] max-w-none -translate-x-1/2 opacity-[0.12]"
            viewBox="0 0 800 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120 Q200 40 400 100 T800 80"
              stroke="white"
              strokeWidth="1.25"
            />
            <path
              d="M0 160 Q280 200 520 130 T800 150"
              stroke="white"
              strokeWidth="1"
              opacity="0.7"
            />
          </svg>
        </div>
        <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center">
          <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 text-center md:gap-10">
            <div className="flex justify-center">
              <BrandPanelMark />
            </div>
            <div className="flex flex-col gap-5 md:gap-6">
              <h1 className="text-[1.875rem] font-bold leading-tight tracking-tight text-[#FFFFFF] md:text-4xl lg:text-5xl lg:leading-[1.1]">
                Hello Whop!
              </h1>
              <p className="text-base leading-[1.65] text-[#FFFFFF] md:text-lg md:leading-relaxed lg:text-xl lg:leading-relaxed">
                Skip scattered threads and endless catch-up messages. Chat in
                real time, stay aligned with your team, and let instant updates
                replace busywork—so you move faster and win back time every day.
              </p>
            </div>
          </div>
        </div>
        <p className="relative z-10 mt-8 shrink-0 text-center text-sm leading-snug text-[#FFFFFF] md:mt-10">
          © {new Date().getFullYear()} Whop. All rights reserved.
        </p>
      </aside>
      <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-8 py-10 md:px-14 md:py-12 lg:px-20">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 md:gap-7">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <Logo url="/" imgClass="size-[22px]" />
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
              Welcome Back!
            </h2>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="duythenights@gmail.com"
                          className={underlineInputClassName}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          placeholder="Password"
                          className={underlineInputClassName}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  disabled={isLoggingIn}
                  type="submit"
                  className="h-11 w-full rounded-md border-0 bg-[#111111] font-semibold text-white shadow-none hover:bg-[#111111]/90 focus-visible:ring-primary/35"
                >
                  {isLoggingIn && <Spinner />} Login Now
                </Button>

                <section
                  className="rounded-lg border border-neutral-200 bg-neutral-50/90 px-4 py-4"
                  aria-labelledby="demo-accounts-heading"
                >
                  <h3
                    id="demo-accounts-heading"
                    className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Demo accounts
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {demoAccounts.map((account, index) => (
                      <li
                        key={account.email}
                        className={cn(
                          "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
                          index > 0 &&
                            "border-t border-neutral-200 pt-3 sm:pt-3",
                        )}
                      >
                        <div className="min-w-0 space-y-0.5 text-sm">
                          <p className="font-mono text-foreground">
                            {account.email}
                          </p>
                          <p className="font-mono text-muted-foreground">
                            {account.password}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full shrink-0 border-neutral-300 sm:w-auto"
                          onClick={() => {
                            form.setValue("email", account.email);
                            form.setValue("password", account.password);
                            form.clearErrors(["email", "password"]);
                          }}
                        >
                          Use in form
                        </Button>
                      </li>
                    ))}
                  </ul>
                </section>

                <p className="text-right text-sm text-muted-foreground">
                  Forget password{" "}
                  <button
                    type="button"
                    className="text-primary underline underline-offset-2 transition-colors hover:text-primary/90"
                  >
                    Click here
                  </button>
                </p>
              </div>

              <div className="pt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  to="/sign-up"
                  className="font-medium text-primary underline underline-offset-2 hover:text-primary/90"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
