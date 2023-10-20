"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Session } from "next-auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Edit2, Plus, Upload, X } from "lucide-react";
import { format } from "date-fns";

import { Input } from "@/app/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Calendar } from "@/app/components/ui/calendar";
import { useToast } from "@/app/components/ui/use-toast";
import Spinner from "@/app/components/loading";
import { Button } from "@/app/components/ui/button";
import { splitCamelCaseText, validatePaper } from "@/app/utils";
import { IVFormSchema, iVInitialValues } from "@/app/onboarding/helpers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { cn, dobRange, validatePassport } from "@/app/utils";
import { Avatar, AvatarImage } from "@/app/components/ui/avatar";
import { Checkbox } from "@/app/components/ui/checkbox";

const CATEGORIES = ["motorcycle", "car", "van", "truck"];

function passportLoader({ src, width }: { src: string; width: number }) {
  const params = ["c_scale", "f_auto", `w_${width}`, "q_auto"];
  return `https://res.cloudinary.com/drgtk7a9s/image/upload/${params.join(
    ","
  )}${src}`;
}

type FormDataType = z.infer<typeof IVFormSchema>;

export interface SocMedia {
  name: "twitter" | "facebook" | "instagram";
  handle: string;
}

const uploadFiles = async (file: FormData) => {
  return await fetch(`/api/uploads`, {
    method: "POST",
    body: file,
  });
};

const deleteFiles = async (id: string) => {
  return await fetch(`/api/uploads`, {
    method: "PUT",
    body: JSON.stringify({ id }),
  });
};

const updateMerchant = async (formData: FormDataType, token: string) => {
  const { deliveryCategory, ...rest } = formData;

  const category = {
    bike: deliveryCategory.includes("motorcycle"),
    car: deliveryCategory.includes("car"),
    van: deliveryCategory.includes("van"),
    truck: deliveryCategory.includes("truck"),
  };

  const res = await fetch(`/api/profile/individual`, {
    method: "PUT",
    body: JSON.stringify({ ...rest, deliveryCategory: category }),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const { data } = await res.json();

  return data;
};

export default function MerchantForm({
  user,
}: {
  user: Session["user"] & { token: string };
}) {
  const [isEditing, setEditing] = useState(false);
  const [isPaperUploading, setPaperUploading] = useState(false);
  const [isImageUploading, setImageUploading] = useState(false);
  const [passport, setPassport] = useState<Record<string, string>>();
  const [passportError, setPassportError] = useState<string>();
  const [vPapers, setVPapers] = useState<Record<string, string>[]>([]);
  const [vPapersError, setVPaperError] = useState<string>();

  const form = useForm<FormDataType>({
    resolver: zodResolver(IVFormSchema),
    mode: "onBlur",
    defaultValues: iVInitialValues,
  });
  const { toast } = useToast();
  const { dateFrom, dateTo, defaultMonth } = dobRange();

  useEffect(() => {
    const passport: Record<string, string> = JSON.parse(
      localStorage.getItem("passport") as string
    );
    const vPapers: Record<string, string>[] = JSON.parse(
      localStorage.getItem("vPapers") as string
    );

    setPassport(passport);
    form.setValue("image", passport?.url);

    if (vPapers) {
      const papers = vPapers.map((paper) => ({
        vehicalPaperImages: paper.url,
        type: "image",
        name: paper.name,
      }));
      form.setValue("vehiclePapers", papers);
      setVPapers(vPapers);
    }
  }, []);

  const convertBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUploading(true);
    const file = e.target.files?.item(0);

    if (file) {
      const err = validatePassport(file);

      if (err) {
        setPassportError(err);
        return;
      }

      const data = await convertBase64(file);
      const imgForm = new FormData();
      imgForm.append("data", data);
      imgForm.append("folder", `onboarding/individual/passports`);
      imgForm.append("filename", user.id);
      imgForm.append("upload_preset", "onboarding-passports");

      try {
        const res = await uploadFiles(imgForm);

        if (!res?.ok) {
          toast({
            variant: "destructive",
            duration: 1000 * 60 * 8,
            title: "Error",
            description:
              "An error occured uploading your passport photo, please try again",
          });
          return;
        }

        const data = await res.json();
        const img = {
          name: file.name,
          size: Math.round(Number(data.bytes) / 1024) + "kb",
          src: `/v${data.version}/${data.public_id}`,
          url: data.secure_url,
        };

        setPassport(img);
        form.setValue("image", img.url, {
          shouldDirty: true,
          shouldTouch: true,
        });
        localStorage.setItem("passport", JSON.stringify(img));
      } catch (error) {
        toast({
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

    const dataFile = await convertBase64(file);
    const userId = user.id;

    const imgForm = new FormData();
    imgForm.append("data", dataFile);
    imgForm.append("folder", `onboarding/individual/papers/${userId}`);
    imgForm.append("filename", btoa(file.name));
    imgForm.append("upload_preset", "onboarding-vehicle-papers");

    try {
      setPaperUploading(true);
      const res = await uploadFiles(imgForm);
      const data = await res.json();
      console.log(data);

      if (!res?.ok) {
        toast({
          variant: "destructive",
          duration: 1000 * 60 * 8,
          title: "Error",
          description:
            "An error occured uploading your passport photo, please try again",
        });
        return;
      }

      const paper = {
        id: data.public_id,
        name: file.name,
        size: Math.round(Number(data.bytes) / 1024) + "kb",
        src: `/v${data.version}/${data.public_id}`,
        url: data.secure_url,
      };

      const papers = [...vPapers, paper];
      setVPapers(papers);
      localStorage.setItem("vPapers", JSON.stringify(papers));
      const papersUrl = papers.map((paper) => ({
        vehicalPaperImages: paper.url,
        type: "image",
        name: paper.name,
      }));
      form.setValue("vehiclePapers", papersUrl, { shouldValidate: true });
    } catch (error) {
      toast({
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
      console.log(data);

      if (data.result !== "ok") {
        toast({
          variant: "destructive",
          duration: 1000 * 60 * 8,
          title: "Error",
          description: "Failed to delete vehicle paper, please try again",
        });
        return;
      }

      setVPapers(vpapersArr);
      localStorage.setItem("vPapers", JSON.stringify(vpapersArr));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured, please try again",
      });
    } finally {
      setPaperUploading(false);
    }
  };

  async function handleSubmit(formData: FormDataType) {
    try {
      const res = await updateMerchant(formData, user.token);

      if (!res?.success) {
        toast({
          variant: "destructive",
          title: splitCamelCaseText(res?.name) || undefined,
          description:
            res.data[0].message ||
            "There was a problem with your request, please try again",
        });
        return;
      }

      toast({
        variant: "primary",
        title: splitCamelCaseText(res?.name) || undefined,
        description:
          res.message || "Your business details was successfully updated",
      });

      form.reset();
      localStorage.removeItem("passport");
      localStorage.removeItem("vPapers");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured",
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
                    <ul className="flex items-center gap-2">
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
                          <button
                            className="rounded-full bg-white p-1 z-10 absolute right-0 bottom-0"
                            type="button"
                            onClick={() => removePaper(paper)}
                          >
                            <X className="w-4 h-4" />
                          </button>
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
                {passport ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="rounded-none relative">
                      <AvatarImage asChild>
                        <Image
                          loader={passportLoader}
                          width={40}
                          height={40}
                          src={passport.src}
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
                <FormLabel className="">Bank Name</FormLabel>
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
                <FormLabel className="">Bank Accont No.</FormLabel>
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
                      >
                        {field.value && format(new Date(field.value), "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4" />
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
            <FormItem className="grid grid-cols-2 space-y-0 lg:grid-cols-4 gap-3">
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
                <FormLabel className="">
                  State
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
            name="addressDetail.country"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">
                  Country
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
        <div className="w-full flex justify-end">
          {isEditing ? (
            <Button
              disabled={form.formState.isSubmitting || !form.formState.isValid}
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
          ) : (
            <Button
              type="button"
              size="lg"
              className="font-bold text-lg xl:text-2xl hover:bg-primary hover:opacity-90 transition-opacity"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
