import { shoesContext } from "@/contexts/ShoesContext";
import { userInfoContext } from "@/contexts/UserInfoContext";
import { useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  phone: z.string().refine(
    (phone) => {
      let prefix = phone.slice(0, 3);
      let length = phone.length;

      if (
        ["091", "092", "093", "094"].includes(prefix) &&
        (length === 10 || length === 11)
      ) {
        return true;
      }

      return false;
    },
    { message: "Invalid phone" }
  ),
  address: z.string().min(3, { message: "Address must be greater than 3" }),
  size: z.string(),
  amount: z.string(),
});

/**
 *
 */

type FormInputs = z.infer<typeof schema>;

function Purchase() {
  const {
    control,
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    setValue,
    setError,
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
  });

  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { title, image, sizes, availability } = useContext(shoesContext).filter(
    (shoe) => shoe._id == id
  )[0];

  const user = useContext(userInfoContext);
  const queryClient = useQueryClient();

  const selectedSize = useWatch({
    control,
    name: "size",
  });

  useEffect(() => {
    setValue("amount", "1");
  }, [selectedSize]);

  function findAmount(s: string) {
    let sizesCopy = sizes.split(" ");

    for (let i = 0; i < sizesCopy.length; i++) {
      if (sizesCopy[i] == s) {
        return availability.split(" ")[i];
      }
    }
  }

  const order: SubmitHandler<FormInputs> = async (data) => {
    
    const dataToSend = {
      userName: user.name,
      userPhoneNumber: data.phone,
      userAddress: data.address,
      shoesName: title,
      shoesImage: image,
      orderedSize: data.size,
      orderedAmount: data.amount,
    };

    const res = await fetch(`${import.meta.env.VITE_API}/orders`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    const resDa = await res.json();

    if (res.ok) {
      await queryClient.invalidateQueries({ queryKey: ["ordersUser"] });

      navigate("/");

      setTimeout(() => {
        toast({
          variant: "default",
          title: "Success",
          description: "Your order created successfully, check your cart",
        });
      }, 500);
    } else {
      setError("root", { message: resDa.message });
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      onSubmit={handleSubmit(order)}
    >
      <div className="p-4 w-96">
        <div className="flex flex-col items-center gap-3 mb-6">
          <img className="w-96 rounded-lg" src={image} alt="" />
          <h2 className="font-medium">{title}</h2>
        </div>

        <form action="" className="flex flex-col gap-3">
          <Label>Phone</Label>
          <Input {...register("phone")} placeholder="Phone: 091#######" />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}

          <Label>Address</Label>
          <Input {...register("address")} placeholder="Address" />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          )}
          <div className="flex gap-3">
            <Controller
              name="size"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className={errors.size ? "border-destructive w-44" : "w-44"}
                  >
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.split(" ").map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {selectedSize && (
              <Input
                {...register("amount")}
                className={errors.amount ? "border-destructive w-44" : "w-44"}
                placeholder="Amount"
                type="number"
                min={1}
                max={findAmount(selectedSize)}
              />
            )}
          </div>

          <Button disabled={isSubmitting}>
            {isSubmitting ? "..." : "Order"}
          </Button>
          {errors.root && (
            <p className="text-xs text-destructive">{errors.root.message}</p>
          )}
          <Button onClick={() => navigate("/shoes")} variant={"destructive"}>
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Purchase;
