import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Footprints } from "lucide-react";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { authContext } from "./contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  userOrderId: z
    .string()
    .min(5, { message: "Customer Id must not be less than 5 characters" }),
  deliveryOrderId: z
    .string()
    .min(5, { message: "Delivery Id must not be less than 5 characters" }),
});

type FormInputs = z.infer<typeof schema>;

export default function Home() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
  });
  const [success, setSuccess] = useState("");
  const auth = useContext(authContext);

  const verifyOrder: SubmitHandler<FormInputs> = async (data) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/orders/verify-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const resDa = await res.json();
      if (res.ok) {
        setSuccess(resDa.message);
      } else {
        setError("root", { message: resDa.message });
      }
    } catch (error) {
      console.log(error);
      setError("root", { message: "server error" });
    }
  };

  return (
    <>
      {auth ? (
        <form
          onSubmit={handleSubmit(verifyOrder)}
          className="flex flex-col items-center w-[400px] h-fit gap-2 absolute inset-0 m-auto"
        >
          <Footprints className="w-[60px] h-[60px]" />
          Vuitton Portal
          <Input {...register("userOrderId")} placeholder="Customer Id" />
          {errors.userOrderId && (
            <p className="self-start text-xs text-destructive">
              {errors.userOrderId.message}
            </p>
          )}
          <Input {...register("deliveryOrderId")} placeholder="Delivery Id" />
          {errors.deliveryOrderId && (
            <p className="self-start text-xs text-destructive">
              {errors.deliveryOrderId.message}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Checking..." : "Check"}
          </Button>
          {errors.root && (
            <p className="self-start text-xs text-destructive">
              {errors.root.message}
            </p>
          )}
          {success && (
            <p className="self-start text-xs text-green-400">{success}</p>
          )}
        </form>
      ) : (
        <LoginFrom />
      )}
    </>
  );
}

const loginSchema = z.object({
  username: z
    .string()
    .min(4, { message: "username must be at least 4 characters" }),
  password: z.string().min(1, { message: "" }),
});

type LoginInputs = z.infer<typeof loginSchema>;

function LoginFrom() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const queryClient = useQueryClient();

  const login: SubmitHandler<LoginInputs> = async (data) => {
    const res = await fetch(`${import.meta.env.VITE_API}/auth/login/agent`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resDa = await res.json();

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    } else {
      setError("root", { message: resDa.message });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(login)}
      className="flex flex-col items-center w-[400px] h-fit gap-2 absolute inset-0 m-auto"
    >
      <Input {...register("username")} placeholder="Username" />
      {errors.username && (
        <p className="self-start text-xs text-destructive">
          {errors.username.message}
        </p>
      )}
      <Input {...register("password")} placeholder="Password" />
      {errors.password && (
        <p className="self-start text-xs text-destructive">
          {errors.password.message}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "..." : "Log in"}
      </Button>
      {errors.root && (
        <p className="self-start text-xs text-destructive">
          {errors.root.message}
        </p>
      )}
    </form>
  );
}
