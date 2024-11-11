import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { imageToBase64 } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(5, "Title must be more than 4 characters"),
  description: z
    .string()
    .min(31, "Description must be more than 30 characters"),
  price: z.string().min(1, "Price is required"),
  type: z.enum(["Male", "Female"]),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: "Image is required" }),
  sizes: z.string().refine(
    (sizes) => {
      const sizesArray = sizes.split(" ");

      for (let i = 0; i < sizesArray.length; i++) {
        for (let j = i + 1; j < sizesArray.length; j++) {
          if (sizesArray[i] === sizesArray[j]) {
            return false;
          }
        }
      }

      for (let value of sizesArray) {
        if (value.length !== 2) {
          return false;
        }

        if (!(!isNaN(Number(value)) && Number.isFinite(parseFloat(value)))) {
          return false;
        }
      }

      return true;
    },
    { message: "Wrong format" }
  ),
  availability: z.string().refine(
    (values) => {
      const availabilityArray = values.split(" ");

      for (let value of availabilityArray) {
        if (!(!isNaN(Number(value)) && Number.isFinite(parseFloat(value)))) {
          return false;
        }
      }

      return true;
    },
    { message: "Wrong format" }
  ),
});

type FormInputs = z.infer<typeof schema>;

function Add() {
  const {
    handleSubmit,
    register,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
  });

  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const add: SubmitHandler<FormInputs> = async (data) => {
    if (data.sizes.split(" ").length !== data.availability.split(" ").length) {
      setError("root", { message: "Sizes must match Availability" });
      return;
    }

    const imageFile = data.image[0]; // Get the first file
    const base64Image = await imageToBase64(imageFile); // Convert to base64

    try {
      const res = await fetch(`${import.meta.env.VITE_API}/shoes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, image: base64Image }),
      });

      const resData = await res.json();

      if (res.ok) {
        await queryClient.invalidateQueries({ queryKey: ["shoes"] });
        navigate("/dashboard/shoes");
      } else {
        setError("root", { message: resData.message });
      }
    } catch (error) {
      console.error(error);
      setError("root", {
        message: "Something went wrong",
      });
    }
  };

  return (
    <div className="w-full h-full relative lg:px-4">
      <div className="flex items-center justify-between">
        <Header>Add shoes</Header>

        <Link to={"/dashboard/shoes"}>
          <img className="size-7" src="../../SVGs/return.svg" alt="" />
        </Link>
      </div>

      <form onSubmit={handleSubmit(add)} className="flex flex-col gap-2 mt-8">
        <Input {...register("title")} placeholder="Title" />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
        <Textarea {...register("description")} placeholder="Description" />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
        <Input type="number" {...register("price")} placeholder="Price $" />
        {errors.price && (
          <p className="text-xs text-destructive">{errors.price.message}</p>
        )}
        <Input {...register("sizes")} placeholder="Sizes ,format: 42 43 .." />
        {errors.sizes && (
          <p className="text-xs text-destructive">{errors.sizes.message}</p>
        )}
        <Input
          {...register("availability")}
          placeholder="Availability ,format: 1 2 .."
        />
        {errors.availability && (
          <p className="text-xs text-destructive">
            {errors.availability.message}
          </p>
        )}

        <Input type="file" {...register("image")} />
        {errors.image && (
          <p className="text-xs text-destructive">{errors.image.message}</p>
        )}

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {errors.type && (
          <p className="text-xs text-destructive">{errors.type.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-[180px]">
          {isSubmitting ? "..." : "Add"}
        </Button>
        {errors.root && (
          <p className="text-xs text-destructive">{errors.root.message}</p>
        )}
        {success && <p className="text-xs text-green-400">{success}</p>}
      </form>
    </div>
  );
}

export default Add;
