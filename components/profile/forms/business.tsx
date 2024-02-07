import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR, { mutate } from "swr";
import { CalendarIcon, Edit2, Upload } from "lucide-react";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { splitCamelCaseText } from "@/lib/utils";
import { BVFormSchema } from "@/components/onboarding/helpers";
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
import { cn, dobRange, validatePassport } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import $api from "@/lib/axios";
import { User } from "@/types";
import useSession from "@/hooks/session";

const CATEGORIES = ["motorcycle", "car", "van", "truck"];

type FormDataType = z.infer<typeof BVFormSchema>;

export interface SocMedia {
  name: "twitter" | "facebook" | "instagram";
  handle: string;
}

type Props = {
  data: any;
  user: User;
  token: string | null;
};

const uploadFiles = async (file: FormData) => {
  return await fetch(`${process.env.baseUrl}/upload/media`, {
    method: "POST",
    body: file,
  });
};

export default function BusinessForm({ token, data, user }: Props) {
  const [isEditing, setEditing] = useState(false);
  const [isImageUploading, setImageUploading] = useState(false);
  const [passport, setPassport] = useState<Record<string, string>>();
  const [passportError, setPassportError] = useState<string>();
  const [socialMediaFormCount, setSocialMediaFormCount] = useState(1);
  const [socialMedia, setSocialMedia] = useState<Record<string, SocMedia>>({});
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const business = data.business;
  const { update } = useSession();
  const form = useForm<FormDataType>({
    resolver: zodResolver(BVFormSchema),
    mode: "onSubmit",
    defaultValues: {
      billingEmail: business?.contactInformation?.general?.billingEmail || "",
      supportEmail: business?.contactInformation?.general?.supportEmail || "",
      tin: business?.merchantInformation?.tin || "",
      registrationNumber:
        business?.merchantInformation?.registrationNumber || "",
      bankAccountDetail: {
        accountNumber: business?.paymentDetails?.accountNumber || "",
        bankName: business?.paymentDetails?.bankName || "",
      },
      deliveryCategory: business?.deliveryVehicleInformation
        ? Object.entries(business?.deliveryVehicleInformation)
            .filter(([_, value]) => {
              const val = value as { available: boolean; count: number };
              return val.available;
            })
            .map(([category, _]) =>
              category === "bike" ? "motorcycle" : category
            )
        : [],
      directorDetail: {
        dateOfBirth: business?.contactInformation?.director.dateOfBirth
          ? new Date(business?.contactInformation?.director.dateOfBirth)
          : undefined,
        firstName: business?.contactInformation?.director?.firstName || "",
        lastName: business?.contactInformation?.director?.lastName || "",
        image: business?.contactInformation?.director?.image || "",
        idNumber: business?.contactInformation?.director?.idNumber || "",
        idType: business?.contactInformation?.director?.idType || "",
      },
      addressDetail: {
        flatNumber:
          business?.contactInformation?.officeAddress.flatNumber || "",
        landmark: business?.contactInformation?.officeAddress.landmark || "",
        buildingNumber:
          business?.contactInformation?.officeAddress.buildingNumber || "",
        buildingName:
          business?.contactInformation?.officeAddress.buildingName || "",
        street: business?.contactInformation?.officeAddress.street || "",
        subStreet: business?.contactInformation?.officeAddress.subStreet || "",
        country: business?.contactInformation?.officeAddress.country || "",
        state: business?.contactInformation?.officeAddress.state || "",
        city: business?.contactInformation?.officeAddress.city || "",
      },
    },
  });
  const { toast } = useToast();
  const { data: res } = useSWR(`/options/countries`, () =>
    $api({ url: `/options/countries` })
  );
  const { dateFrom, dateTo, defaultMonth } = dobRange();

  useEffect(() => {
    const image = business?.contactInformation?.director.image || "";

    const soc = {
      twitter: business?.contactInformation?.general.twitter || "",
      facebook: business?.contactInformation?.general.facebook || "",
      instagram: business?.contactInformation?.general.instagram || "",
    };

    let index = 0;
    const sMedia = Object.assign(
      {},
      ...Object.entries(soc).map(([name, handle]) => {
        let entries;
        if (handle) {
          entries = { [index]: { name, handle } };
          index += 1;
          return entries;
        } else return;
      })
    );

    const sMediaCount = Object.keys(sMedia).length;

    setPassport({ url: image });
    setSocialMedia(sMedia);
    setSocialMediaFormCount(sMediaCount || 1);
  }, []);

  useEffect(() => {
    if (res) {
      const countries = res.data;
      const states = res.data[0].states;

      setCountries(countries);
      setStates(states);
    }
  }, [res]);

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
          duration: 1000 * 5,
          variant: "destructive",
          title: data?.name || "Error",
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
      localStorage.setItem("passport", JSON.stringify(image));
    } catch (error) {
      toast({
        duration: 1000 * 5,
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured, please try again",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddSocialMedia = () => {
    if (socialMediaFormCount === 3) return;
    setSocialMediaFormCount(socialMediaFormCount + 1);
  };

  const handleRemoveSocialMedia = () => {
    if (socialMediaFormCount === 1) return;
    setSocialMediaFormCount(socialMediaFormCount - 1);
  };

  async function handleSubmit(formData: FormDataType) {
    try {
      setEditing(false);
      const socMedia = Object.assign(
        {},
        ...Object.values(socialMedia).map(({ name, handle }) => ({
          [name]: handle,
        }))
      );

      const { deliveryCategory, ...rest } = formData;
      const category = {
        bike: deliveryCategory.includes("motorcycle"),
        car: deliveryCategory.includes("car"),
        van: deliveryCategory.includes("van"),
        truck: deliveryCategory.includes("truck"),
      };

      const res = await $api({
        method: "post",
        token,
        url: "/merchants/business/account/verification",
        data: { ...rest, deliveryCategory: category, socialMedia: socMedia },
      });
      const status = res.data.status;
      const verificationCount = res.data.verificationChecks;

      mutate({ ...data, business: res.data.business });
      update({ status, verificationCount });

      toast({
        variant: "primary",
        description:
          res.message || "Your business details was successfully updated",
      });
    } catch (error: any) {
      toast({
        duration: 1000 * 5,
        variant: "destructive",
        title: splitCamelCaseText(error.data?.name) || undefined,
        description:
          error.data?.message ||
          error.message ||
          error.data[0]?.message ||
          "There was a problem with your request, please try again",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          <FormField
            control={form.control}
            name="billingEmail"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">
                  Billing Email
                  <span className="text-red-600 text-xl leading-none">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={!isEditing} />
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
                  <Input type="text" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          <FormField
            control={form.control}
            name="directorDetail.firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">
                  First Name
                  <span className="text-red-600 text-xl leading-none">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={!isEditing} />
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
                  Last Name
                  <span className="text-red-600 text-xl leading-none">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          <FormField
            control={form.control}
            name="directorDetail.idType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Director’s ID Type
                  <span className="text-red-600 text-xl leading-none">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bvn">
                      Bank Verification Number
                    </SelectItem>
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
                  <Input type="text" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
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
                        disabled={!isEditing}
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
                {passport?.url ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="rounded-none relative">
                      <AvatarImage asChild src={passport?.url}>
                        <Image
                          width={40}
                          height={40}
                          src={form.getValues("directorDetail.image")}
                          alt="Director's passport"
                        />
                      </AvatarImage>
                      <FormLabel className="absolute inset-0 bg-transparent hover:bg-black/10 transition-colors block w-full"></FormLabel>
                      <span className="rounded-full bg-white p-1 absolute right-0 bottom-0">
                        <Edit2 className="w-2 h-2" />
                      </span>
                    </Avatar>
                    <span className="text-xs text-gray-600">
                      <p className="mb-1 font-medium">{passport?.name}</p>
                      <p className="font-medium">{passport?.size}</p>
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
                    disabled={!isEditing}
                    onChange={handleImgUpload}
                  />
                </FormControl>
                <FormMessage>{passportError}</FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
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
                  <Input type="text" {...field} disabled={!isEditing} />
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
                  <Input type="text" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="block xl:grid xl:grid-cols-2 gap-3 space-y-8 xl:space-y-0">
          <div className="space-y-4">
            <FormLabel>
              Categories
              <span className="text-red-600 text-xl leading-none">*</span>
            </FormLabel>
            <FormItem className="flex items-center gap-6 space-y-0">
              {CATEGORIES.map((category) => (
                <FormField
                  control={form.control}
                  name="deliveryCategory"
                  key={category}
                  render={({ field }) => (
                    <FormItem
                      key={category}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          disabled={!isEditing}
                          checked={field.value?.includes(category)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, category])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== category
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="capitalize">{category}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          </div>
          <div className="space-y-1 md:space-y-4">
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-3 gap-4 flex-1">
                <h2 className="text-sm font-medium col-span-1">Social Media</h2>
                <h2 className="text-sm font-medium col-span-2">
                  Social Media Handle
                </h2>
              </div>
            </div>
            {Array.from({ length: socialMediaFormCount }, (_, k) => (
              <div key={k} className="grid grid-cols-3 gap-4">
                <FormField
                  name="socialMedia"
                  render={() => (
                    <>
                      <FormItem>
                        <Select
                          disabled={!isEditing}
                          onValueChange={(e) =>
                            setSocialMedia({
                              ...socialMedia,
                              [k]: {
                                ...socialMedia[k],
                                name: e,
                              },
                            })
                          }
                          value={socialMedia[k]?.name}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </>
                  )}
                />
                <FormField
                  name="socialMedia"
                  render={() => (
                    <FormItem className="w-full col-span-2">
                      <FormControl>
                        <Input
                          type="text"
                          disabled={!isEditing}
                          value={socialMedia[k]?.handle}
                          onChange={(e) =>
                            setSocialMedia({
                              ...socialMedia,
                              [k]: {
                                ...socialMedia[k],
                                handle: e.target.value,
                              },
                            })
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <div className="flex items-center gap-5 justify-end">
              <Button
                variant="outline"
                className="w-6 h-6 flex items-center justify-center text-lg leading-none"
                type="button"
                disabled={!isEditing}
                onClick={handleAddSocialMedia}
              >
                +
              </Button>
              <Button
                variant="outline"
                className="w-6 h-6 flex items-center justify-center text-lg leading-none"
                type="button"
                disabled={!isEditing}
                onClick={handleRemoveSocialMedia}
              >
                -
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          <FormField
            control={form.control}
            name="bankAccountDetail.bankName"
            render={({ field }) => (
              <FormItem className="w-full space-y-0">
                <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5">
                  Bank Name
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankAccountDetail.accountNumber"
            render={({ field }) => (
              <FormItem className="w-full space-y-0">
                <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5">
                  Bank Account No.
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <h2 className="font-semibold text-sm">Address Details</h2>
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          <div className="sm:grid sm:grid-cols-3 gap-2 space-y-8 sm:space-y-0">
            <FormField
              control={form.control}
              name="addressDetail.flatNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="">Flat Number</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressDetail.buildingName"
              render={({ field }) => (
                <FormItem className="w-full col-span-2">
                  <FormLabel className="">Building Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="addressDetail.landmark"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">
                  Landmark
                  <span className="text-red-600 text-xl leading-none">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          <div className="block sm:grid grid-cols-2 gap-2 space-y-6 sm:space-y-0">
            <FormField
              control={form.control}
              name="addressDetail.buildingNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="">
                    Building No.
                    <span className="text-red-600 text-xl leading-none">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressDetail.street"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="">
                    Street
                    <span className="text-red-600 text-xl leading-none">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="block sm:grid grid-cols-2 gap-2 space-y-6 sm:space-y-0">
            <FormField
              control={form.control}
              name="addressDetail.subStreet"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="">Substreet</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressDetail.city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="">
                    City
                    <span className="text-red-600 text-xl leading-none">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          <FormField
            control={form.control}
            name="addressDetail.state"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>State</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-80">
                    {states.map((state: any) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressDetail.country"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-80">
                    {countries.map((country: any) => (
                      <SelectItem key={country.alpha2Code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {["pending-activation", "rejected", "activated"].includes(
          user.status
        ) && (
          <div className="w-full flex justify-end gap-4">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  size="lg"
                  variant="destructive"
                  className="font-bold text-lg xl:text-2xl transition-opacity"
                  onClick={() => {
                    form.reset();
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={form.formState.isSubmitting}
                  size="lg"
                  className="font-bold text-lg xl:text-2xl hover:bg-primary hover:opacity-90 transition-opacity"
                >
                  Submit
                  {form.formState.isSubmitting && (
                    <Spinner
                      twColor="text-white before:bg-white"
                      twSize="w-4 h-4"
                      className="ml-3"
                    />
                  )}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                size="lg"
                className="font-bold text-lg xl:text-2xl hover:bg-primary hover:opacity-90 transition-opacity"
                disabled={["processing-activation", "activated"].includes(
                  user.status
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setEditing(true);
                }}
              >
                Edit
              </Button>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
