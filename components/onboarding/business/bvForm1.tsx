import { useEffect, useState } from "react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { CalendarIcon, Edit2, HelpCircle, Upload } from "lucide-react";
import { format } from "date-fns";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, dobRange, validatePassport } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/spinner";

type FormDataType = UseFormReturn<
  {
    billingEmail: string;
    supportEmail?: string;
    tin: string;
    registrationNumber: string;
    deliveryCategory: string[];
    bankAccountDetail: {
      bankName: string;
      accountNumber: string;
    };
    directorDetail: {
      idNumber: string;
      idType: string;
      firstName: string;
      lastName: string;
      image: string;
      dateOfBirth: Date;
    };
    addressDetail: {
      flatNumber?: string;
      landmark: string;
      buildingNumber: string;
      buildingName?: string;
      street: string;
      subStreet?: string;
      country: string;
      state: string;
      city: string;
    };
  },
  any,
  any
>;

type Props = {
  form: FormDataType;
  passport: Record<string, string>;
  setPassport: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

const uploadFiles = async (form: FormData) => {
  return await fetch(`${process.env.baseUrl}/upload/media`, {
    method: "POST",
    body: form,
  });
};

export default function BusinessVerificationForm1(props: Props) {
  const { form, passport, setPassport } = props;
  const [isImageUploading, setImageUploading] = useState(false);
  // const [passport, setPassport] = useState<Record<string, string>>();
  const [passportError, setPassportError] = useState<string>();

  const { toast } = useToast();
  const { dateFrom, dateTo, defaultMonth } = dobRange();

  // useEffect(() => {
  //   const passport: Record<string, string> = JSON.parse(
  //     localStorage.getItem("passport") as string
  //   );

  //   if (passport) {
  //     setPassport(passport);
  //     form.setValue("directorDetail.image", passport.url);
  //   }
  // }, []);

  const handleImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);

    if (!file) return;

    const err = validatePassport(file);

    if (err) {
      setPassportError(err);
      return;
    }

    const imgForm = new FormData();
    imgForm.append("files", file);

    try {
      setImageUploading(true);
      const res = await uploadFiles(imgForm);
      const { data } = await res.json();

      if (!res.ok) {
        toast({
          variant: "destructive",
          duration: 1000 * 4,
          title: "Error",
          description:
            data?.message ||
            "An error occured uploading your passport photo, please try again",
        });
        return;
      }

      const image = {
        name: data[0].originalName,
        size: Math.round(Number(data[0].sizeInBytes) / 1024) + "kb",
        url: data[0].location,
      };

      setPassport(image);
      form.setValue("directorDetail.image", image.url);
      // localStorage.setItem("passport", JSON.stringify(image));
    } catch (error) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured, please try again",
      });
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
        <FormField
          control={form.control}
          name="billingEmail"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">
                Billing Email
                <span className="text-red-600 text-xl leading-none">*</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-3 h-3 ml-1" />
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent>
                        <p>
                          Enter the email address where we&apos;ll send your
                          bills and payment receipts
                        </p>
                        <TooltipArrow />
                      </TooltipContent>
                    </TooltipPortal>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supportEmail"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">Support Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
        <FormField
          control={form.control}
          name="directorDetail.firstName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">
                Directors First Name
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="directorDetail.lastName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">
                Directors Last Name
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
        <FormField
          control={form.control}
          name="directorDetail.idType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Director’s ID Type
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bvn">Bank Verification Number</SelectItem>
                  <SelectItem value="passport">
                    International Passport
                  </SelectItem>
                  <SelectItem value="drivers_license">
                    Driver&apos;s License
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="directorDetail.idNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">
                ID Number
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
        <FormField
          control={form.control}
          name="directorDetail.dateOfBirth"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">
                Date Of Birth
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value && format(new Date(field.value), "PPP")}
                      <CalendarIcon className="ml-auto h-4 w-4 text-primary" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    defaultMonth={defaultMonth}
                    captionLayout="dropdown"
                    fromYear={dateFrom}
                    toYear={dateTo}
                    disabled={(date) =>
                      date > new Date(new Date().setFullYear(dateTo)) ||
                      date < new Date(new Date().setFullYear(dateFrom))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="image"
          render={() => (
            <FormItem className="">
              <div className="flex items-center">
                <FormLabel className="after:text-red-600 after:ml-1 after:content-['*'] after:text-xl after:leading-none flex-1">
                  Passport Photo
                </FormLabel>
                {isImageUploading && (
                  <Spinner
                    twColor="text-primary before:bg-primary"
                    twSize="w-3 h-3"
                    className="ml-3"
                  />
                )}
              </div>
              {passport ? (
                <div className="flex items-center gap-3">
                  <Avatar className="rounded-none relative">
                    <AvatarImage asChild src={passport.url}>
                      <Image
                        width={40}
                        height={40}
                        src={passport.url}
                        alt="Director's passport"
                      />
                    </AvatarImage>
                    <FormLabel className="absolute inset-0 bg-transparent hover:bg-black/10 transition-colors block w-full"></FormLabel>
                    <span className="rounded-full bg-white p-1 absolute right-0 bottom-0">
                      <Edit2 className="w-2 h-2" />
                    </span>
                  </Avatar>
                  <span className="text-xs text-gray-600">
                    <p className="mb-1 font-medium">{passport.name}</p>
                    <p className="font-medium">{passport.size}</p>
                  </span>
                </div>
              ) : (
                <FormLabel className="text-xs py-1 w-full flex flex-col items-center bg-gray-100/40 hover:bg-gray-100 transition-colors gap-1 border border-dashed rounded-lg">
                  <Upload className="w-3 h-3" />
                  Upload Passport Photo
                </FormLabel>
              )}
              <FormControl>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImgUpload}
                />
              </FormControl>
              <FormMessage>{passportError}</FormMessage>
            </FormItem>
          )}
        />
      </div>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
        <FormField
          control={form.control}
          name="tin"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">
                Tax Identification Number
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">
                RC Number
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
