import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormInputs = z.infer<typeof schema>;

function Add() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
  });

  const [success, setSuccess] = useState("");

  const addAgent: SubmitHandler<FormInputs> = async (data) => {
    const res = await fetch(`${import.meta.env.VITE_API}/auth/register/agent`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resDa = await res.json();

    console.log(resDa);
    

    if (res.ok) {
      setSuccess(resDa.message);
    } else {
      setError("root", { message: resDa.message });
    }
  };

  return (
    <div className="w-full h-full relative lg:px-4">
      <div className="flex items-center justify-between">
        <Header>Add agents</Header>

        <Link to={"/dashboard/agents"}>
          <img className="size-7" src="../../SVGs/return.svg" alt="" />
        </Link>
      </div>
      <form
        onSubmit={handleSubmit(addAgent)}
        className="flex flex-col gap-2 mt-8"
      >
        <Input {...register("username")} placeholder="Username" />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        )}
        <Input {...register("password")} placeholder="Password" />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "..." : "Add"}
        </Button>
        {success && <p className="text-xs text-green-400">{success}</p>}
        {errors.root && (
          <p className="text-xs text-destructive">{errors.root.message}</p>
        )}
      </form>
    </div>
  );
}

export default Add;
