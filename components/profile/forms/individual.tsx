"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Edit2, Plus, Upload, X } from "lucide-react";
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
import { splitCamelCaseText, validatePaper } from "@/lib/utils";
import { IProfileFormSchema } from "@/components/onboarding/helpers";
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

type FormDataType = z.infer<typeof IProfileFormSchema>;

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

const uploadDoc = async (form: FormData) => {
  return await fetch(`${process.env.baseUrl}/upload/document`, {
    method: "POST",
    body: form,
  });
};

const deleteFiles = async (id: string) => {
  return await fetch(`/api/uploads/${id}`, {
    method: "DELETE",
  });
};

export default function IndividualForm({ token, data, user }: Props) {
  const [isEditing, setEditing] = useState(false);
  const [isPaperUploading, setPaperUploading] = useState(false);
  const [isImageUploading, setImageUploading] = useState(false);
  const [passport, setPassport] = useState<Record<string, string>>();
  const [passportError, setPassportError] = useState<string>();
  const [vPapers, setVPapers] = useState<Record<string, string>[]>([]);
  const [vPapersError, setVPaperError] = useState<string>();
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const business = data.business;
  const { update } = useSession();
  const form = useForm<FormDataType>({
    resolver: zodResolver(IProfileFormSchema),
    mode: "onSubmit",
    defaultValues: {
      vehicleNumber: business?.merchantInformation?.vehicleNumber || "",
      driversLicense: business?.merchantInformation?.driversLicense || "",
      dateOfBirth: business?.contactInformation?.person.dateOfBirth
        ? new Date(business?.contactInformation?.person.dateOfBirth)
        : undefined,
      image: business?.contactInformation?.person.image || "",
      vehiclePapers: business?.document || [],
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
      bankAccountDetail: {
        accountNumber: business?.paymentDetails.accountNumber || "",
        bankName: business?.paymentDetails.bankName || "",
      },
      addressDetail: {
        flatNumber:
          business?.contactInformation?.registeredAddress.flatNumber || "",
        landmark:
          business?.contactInformation?.registeredAddress.landmark || "",
        buildingNumber:
          business?.contactInformation?.registeredAddress.buildingNumber || "",
        buildingName:
          business?.contactInformation?.registeredAddress.buildingName || "",
        street: business?.contactInformation?.registeredAddress.street || "",
        subStreet:
          business?.contactInformation?.registeredAddress.subStreet || "",
        country: business?.contactInformation?.registeredAddress.country || "",
        state: business?.contactInformation?.registeredAddress.state || "",
        city: business?.contactInformation?.registeredAddress.city || "",
      },
    },
  });
  const { toast } = useToast();
  const { data: res } = useSWR(`/options/countries`, () =>
    $api({ url: `/options/countries` })
  );
  const { dateFrom, dateTo, defaultMonth } = dobRange();

  useEffect(() => {
    const image = business.contactInformation?.person.image || "";
    const vp = business.documents;

    setPassport({
      url: image,
    });

    if (vp.length) {
      const papers = vp.map((paper: any) => {
        return {
          url: paper.vehicalPaperImages || "",
          type: paper.type,
          name: paper.name,
        };
      });
      setVPapers(papers);
      const papersUrl = papers.map((paper: any) => ({
        vehicalPaperImages: paper.url,
        type: "image",
        name: paper.name,
      }));

      form.setValue("image", image);
      form.setValue("vehiclePapers", papersUrl);
    }
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
    setImageUploading(true);
    const file = e.target.files?.item(0);

    if (file) {
      const err = validatePassport(file);

      if (err) {
        setPassportError(err);
        return;
      }

      const imgForm = new FormData();
      imgForm.append("files", file);

      try {
        const res = await uploadFiles(imgForm);
        const { data } = await res.json();

        if (!res.ok) {
          toast({
            duration: 1000 * 5,
            variant: "destructive",
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
        form.setValue("image", image.url);
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
    }
  };

  const handlePaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);

    if (!file) return;

    const err = validatePaper(file);

    if (err) {
      setVPaperError(err);
      return;
    }

    const fileExists = vPapers.find((paper) => paper.name === file.name);

    if (fileExists) {
      setVPaperError(`${file.name} file already exists`);
      return;
    }

    const imgForm = new FormData();
    imgForm.append("files", file);

    try {
      setPaperUploading(true);
      const res = await uploadDoc(imgForm);
      const { data } = await res.json();

      if (!res.ok) {
        toast({
          duration: 1000 * 5,
          variant: "destructive",
          title: "Error",
          description:
            data.message ||
            "An error occured uploading your passport photo, please try again",
        });
        return;
      }

      const paper = {
        name: data[0].originalName,
        size: Math.round(Number(data[0].sizeInBytes) / 1024) + "kb",
        url: data[0].location,
        id: data[0].assetId,
      };

      const papers = [...vPapers, paper];
      setVPapers(papers);
      const papersUrl = papers.map((paper) => ({
        vehicalPaperImages: paper.url,
        type: "image",
        name: paper.name,
      }));
      form.setValue("vehiclePapers", papersUrl);
    } catch (error) {
      toast({
        duration: 1000 * 5,
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured, please try again",
      });
    } finally {
      setPaperUploading(false);
    }
  };

  const removePaper = async (paper: Record<string, string>) => {
    const vpapersArr = vPapers.filter((vp) => paper.name !== vp.name);

    try {
      setPaperUploading(true);
      const res = await deleteFiles(paper.id);
      const data = await res.json();

      if (!data.success) {
        toast({
          duration: 1000 * 5,
          variant: "destructive",
          title: "Error",
          description:
            data.message || "Failed to remove vehicle paper, please try again",
        });
        return;
      }

      setVPapers(vpapersArr);
      localStorage.setItem("vPapers", JSON.stringify(vpapersArr));
    } catch (error) {
      toast({
        duration: 1000 * 5,
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured, please try again",
      });
    } finally {
      setPaperUploading(false);
    }
  };

  async function handleSubmit(formData: FormDataType) {
    setEditing(false);
    const { deliveryCategory, ...rest } = formData;

    const category = {
      bike: deliveryCategory.includes("motorcycle"),
      car: deliveryCategory.includes("car"),
      van: deliveryCategory.includes("van"),
      truck: deliveryCategory.includes("truck"),
    };

    try {
      const res = await $api({
        method: "post",
        headers: { Authorization: `Bearer ${token}` },
        url: "/merchants/individual/account/verification",
        data: { ...rest, deliveryCategory: category },
      });
      const status = res.data.status;
      const verificationCount = res.data.verificationChecks;

      mutate({ ...data, business: res.data.business });
      update({ status, verificationCount });

      toast({
        duration: 1000 * 5,
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
            name="vehicleNumber"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">
                  Number Plate
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
            name="driversLicense"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">
                  Driver’s License
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
            name="vehiclePapers"
            render={() => (
              <FormItem className="">
                <div className="flex items-center">
                  <FormLabel className="after:text-red-600 after:ml-1 after:content-['*'] after:text-xl after:leading-none flex-1">
                    Vehicle Papers
                  </FormLabel>
                  {isPaperUploading && (
                    <Spinner
                      twColor="text-primary before:bg-primary"
                      twSize="w-3 h-3"
                      className="ml-3"
                    />
                  )}
                </div>
                {vPapers.length ? (
                  <div className="flex items-end gap-3">
                    <ul className="flex items-center flex-wrap gap-2">
                      {vPapers.map((paper, i) => (
                        <li
                          key={i}
                          className="relative after:absolute after:inset-0 after:bg-transparent hover:after:bg-black/10 after:transition-colors w-[6.5rem] h-10 text-center"
                        >
                          <p className="mb-1 font-semibold text-xs truncate">
                            {paper.name}
                          </p>
                          <p className="font-medium text-gray-500 text-xs">
                            {paper?.size}
                          </p>
                          {/* <button
                            className="rounded-full bg-white p-1 z-10 absolute right-0 bottom-0"
                            type="button"
                            onClick={() => removePaper(paper)}
                          >
                            <X className="w-4 h-4" />
                          </button> */}
                        </li>
                      ))}
                    </ul>
                    <FormLabel className="w-6 h-6 rounded-full flex items-center flex-shrink-0 justify-center border border-primary">
                      <Plus className="w-3 h-3" />
                    </FormLabel>
                  </div>
                ) : (
                  <FormLabel className="text-xs py-1 w-full flex items-center bg-gray-100/40 gap-1 hover:bg-gray-100 transition-colors border border-dashed rounded-lg flex-col">
                    <Upload className="w-3 h-3" />
                    Upload Papers
                  </FormLabel>
                )}
                <FormControl>
                  <input
                    type="file"
                    disabled={!isEditing}
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePaperUpload}
                  />
                </FormControl>
                <FormMessage>{vPapersError}</FormMessage>
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
                          src={passport?.url}
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
                  <FormLabel className="text-xs py-1 w-full flex bg-gray-100/40 hover:bg-gray-100 transition-colors border border-dashed rounded-lg gap-1 flex-col items-center">
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
                  Bank Accont No.
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
          <FormField
            control={form.control}
            name="dateOfBirth"
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
                          checked={field.value?.includes(category)}
                          disabled={!isEditing}
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
        </div>
        <h2 className="font-semibold text-sm">Address Details</h2>
        <div className="xl:grid grid-cols-2 xl:gap-8 space-y-8 xl:space-y-0">
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
        <div className="xl:grid grid-cols-2 gap-8 space-y-8 xl:space-y-0">
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
                      <SelectItem key={country.name} value={country.name}>
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
                onClick={(e) => {
                  e.preventDefault();
                  setEditing(true);
                }}
                disabled={["processing-activation", "activated"].includes(
                  user.status
                )}
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
