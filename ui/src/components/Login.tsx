import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useLayoutEffect } from "react";
import { authContext } from "@/contexts/AuthContext";
import Metadata from "./metadata";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormFields = z.infer<typeof schema>;

function Login() {
  const auth = useContext(authContext);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, []);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();

  const login: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/auth/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (response.ok) {
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["auth"] }),
          queryClient.invalidateQueries({ queryKey: ["userInfo"] }),
          queryClient.invalidateQueries({ queryKey: ["shoes"] }),
          queryClient.invalidateQueries({ queryKey: ["ordersUser"] }),
        ]).finally(() => {
          navigate("/");
        });
      } else {
        setError("root", {
          message: resData.message,
        });
      }
    } catch (error) {
      console.error(error);
      setError("root", {
        message: "Something went wrong",
      });
    }
  };

  return (
    <div className="w-screen h-screen bg-primary">
      <Metadata title="Vuitton - Login" />
      <form
        className="bg-white w-[450px] h-[300px] rounded absolute inset-0 m-auto p-5 flex flex-col gap-2"
        action=""
        onSubmit={handleSubmit(login)}
      >
        <LogIn className="size-14 mx-auto" />
        <Input {...register("email")} placeholder="Email" />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
        <Input
          {...register("password")}
          placeholder="Password"
          type="password"
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
        <div className="flex justify-between items-center mt-auto">
          <Button disabled={isSubmitting}>Log in</Button>
          <Link className="text-xs text-sky-500" to={"/signup"}>
            Don't have an account ?
          </Link>
        </div>
        {errors.root && (
          <p className="text-xs text-destructive">{errors.root.message}</p>
        )}
      </form>
    </div>
  );
}

export default Login;
