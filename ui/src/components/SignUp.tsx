import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useLayoutEffect, useState } from "react";
import { authContext } from "@/contexts/AuthContext";
import { Label } from "./ui/label";
import { imageToBase64 } from "@/lib/utils";
import Metadata from "./metadata";

const schema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters"),
  username: z.string().min(4, "Username must be at least 4 characters"),
  email: z.string().email(),
  password: z.string().min(6, "Password must contain at least 6 character)"),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: "Image is required" }),
});

type FormFields = z.infer<typeof schema>;

function SignUp() {
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

  const [success, setSuccess] = useState("");

  const signUp: SubmitHandler<FormFields> = async (data) => {
    try {
      const imageFile = data.image[0]; // Get the first file
      const base64Image = await imageToBase64(imageFile); // Convert to base64

      const response = await fetch(
        `${import.meta.env.VITE_API}/auth/register`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ ...data, image: base64Image }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await response.json();

      if (response.ok) {
        setSuccess(resData.message);
      } else {
        setSuccess("");
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
      <Metadata title="Vuitton - Sign up" />
      <form
        className="bg-white w-[470px] h-[540px] rounded absolute inset-0 m-auto p-5 flex flex-col gap-2"
        onSubmit={handleSubmit(signUp)}
      >
        <User className="size-14 mx-auto" />
        <Input {...register("name")} placeholder="Full Name" />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}

        <Input {...register("username")} placeholder="Username" />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        )}

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
        <Label htmlFor="image" className="mt-4">
          Choose an image
        </Label>
        <Input {...register("image")} type="file" id="image" accept=".png" />
        {errors.image && (
          <p className="text-xs text-destructive">{errors.image.message}</p>
        )}

        <div className="flex justify-between items-center mt-auto">
          <Button disabled={isSubmitting}>Sign Up</Button>
          <Link className="text-xs text-sky-500" to={"/login"}>
            Have an account ?
          </Link>
        </div>
        {errors.root && (
          <p className="text-xs text-destructive">{errors.root.message}</p>
        )}
        {success && <p className="text-xs text-green-400">{success}</p>}
      </form>
    </div>
  );
}

export default SignUp;
