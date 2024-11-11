import { authContext } from "@/contexts/AuthContext";
import { useContext, useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { userInfoContext } from "@/contexts/UserInfoContext";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { ImageIcon, ShoppingBag } from "lucide-react";
import { imageToBase64 } from "@/lib/utils";
import { ordersUserContext } from "@/contexts/OrdersUserContext";

function Navbar() {
  const auth = useContext(authContext);
  const user = useContext(userInfoContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  let ordersPopUp;

  if (auth) {
    ordersPopUp = useContext(ordersUserContext).filter(
      (order) => order.status === "pending"
    ).length;
  }
  
  async function logout() {
    await fetch(`${import.meta.env.VITE_API}/auth/logout`, {
      credentials: "include",
    });
    location.reload();
  }

  async function saveChanges() {
    try {
      if (!name && !image) {
        setError("Name and image can't be empty");
        return;
      }

      let newImage: string = "";
      if (image) {
        newImage = await imageToBase64(image);
      }

      if (user.name === name && user.image === newImage) {
        setSuccess("");
        setError("You need to change something");
        return;
      }

      setLoading(true);

      const updatedData = { name: user.name, image: user.image };

      if (!name) {
        updatedData.name = user.name;
      }

      if (name) {
        updatedData.name = name;
      }

      if (!image) {
        updatedData.image = user.image;
      }

      if (image) {
        updatedData.image = newImage;
      }

      const response = await fetch(`${import.meta.env.VITE_API}/user/info`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const resData = await response.json();

      if (!response.ok) {
        setSuccess("");
        setError(resData.message);
        setLoading(false);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["userInfo"],
      });

      setError("");
      setSuccess(resData.message);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  }

  return (
    <nav className="p-5 sm:py-5 sm:px-10 flex justify-between items-center">
      <div className="flex h-5 items-center space-x-4 text-sm">
        <h1 className="font-caveat text-4xl">vuitton</h1>
        {auth && (
          <>
            <Separator orientation="vertical" className="hidden sm:block" />
            <img
              className="size-8 rounded-full hidden sm:block"
              src={user.image}
              alt=""
            />
            <p className="font-caveat text-xl hidden sm:block">{user.name}</p>
          </>
        )}
      </div>

      {!auth ? (
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to={"/login"}>Log in</Link>
          </Button>
          <Button asChild>
            <Link to={"/signup"}>Sign up</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to={"/cart"} className="relative">
            {ordersPopUp !== 0 && (
              <span className="absolute bg-orange-400 rounded-full aspect-square w-[20px] text-xs text-white flex justify-center items-center -left-[5px] -top-[5px]">
                {ordersPopUp}
              </span>
            )}
            <ShoppingBag />
          </Link>
          {user.role == "admin" && (
            <Button variant="outline" asChild>
              <Link to={"/dashboard"}>Dashboard</Link>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Profile</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <form className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder={`${user.name}`}
                    className="col-span-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <ImageIcon className="ml-auto" />
                  <Input
                    type="file"
                    className="col-span-3"
                    onChange={(e) => {
                      if (e.target.files) {
                        setImage(e.target.files[0]);
                      }
                    }}
                  />
                  {success && (
                    <p className="text-xs text-green-500 col-span-4">
                      {success}
                    </p>
                  )}
                  {error && (
                    <p className="text-xs text-destructive col-span-4">
                      {error}
                    </p>
                  )}
                </form>
              </div>
              <SheetFooter className="flex justify-between items-center">
                <Button variant="destructive" onClick={logout}>
                  Logout
                </Button>
                <Button onClick={saveChanges} disabled={loading}>
                  Save changes
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
