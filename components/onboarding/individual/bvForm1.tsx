import { useEffect, useState } from "react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { CalendarIcon, Edit2, HelpCircle, Plus, Upload, X } from "lucide-react";
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
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, dobRange, validatePaper, validatePassport } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/spinner";
import useSession from "@/hooks/session";

type FormDataType = UseFormReturn<
  {
    vehicleNumber: string;
    driversLicense: string;
    dateOfBirth: Date;
    image: string;
    guarantorDetail: {
      lastName: string;
      firstName: string;
      email: string;
    };
    deliveryCategory: [string, ...string[]];
    bankAccountDetail: {
      bankName: string;
      accountNumber: string;
    };
    vehiclePapers: Array<{
      vehicalPaperImages: string;
      type: string;
      name: string;
    }>;
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
  undefined
>;

type Props = {
  page: number;
  form: FormDataType;
};

const CATEGORIES = ["motorcycle", "car", "van", "truck"];

const uploadFiles = async (form: FormData) => {
  return await fetch(`${process.env.baseUrl}/upload/media`, {
    method: "POST",
    body: form,
  });
};

const uploadDoc = async (form: FormData) => {
  return await fetch(`${process.env.baseUrl}/upload/document`, {
    method: "POST",
    body: form,
  });
};

const deleteFiles = async (id: string) => {
  return await fetch(`/api/uploads`, {
    method: "PUT",
    body: JSON.stringify({ id }),
  });
};

export default function BusinessVerificationForm1({ form, page }: Props) {
  const [isPaperUploading, setPaperUploading] = useState(false);
  const [isImageUploading, setImageUploading] = useState(false);
  const [passport, setPassport] = useState<Record<string, string>>();
  const [passportError, setPassportError] = useState<string>();
  const [vPapers, setVPapers] = useState<Record<string, string>[]>([]);
  const [vPapersError, setVPaperError] = useState<string>();

  const { toast } = useToast();
  const { dateFrom, dateTo, defaultMonth } = dobRange();

  useEffect(() => {
    const passport: Record<string, string> = JSON.parse(
      localStorage.getItem("passport") as string
    );
    const vPapers: Record<string, string>[] = JSON.parse(
      localStorage.getItem("vPapers") as string
    );

    if (passport) {
      setPassport(passport);
      form.setValue("image", passport.url);
    }

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
            variant: "destructive",
            duration: 1000 * 5,
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
          variant: "destructive",
          duration: 1000 * 5,
          title: "Error",
          description:
            data?.message ||
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
      localStorage.setItem("vPapers", JSON.stringify(papers));
      const papersUrl = papers.map((paper) => paper.url);
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
      console.log(data);

      if (data.result !== "ok") {
        toast({
          variant: "destructive",
          duration: 1000 * 5,
          title: "Error",
          description: "Failed to delete vehicle paper, please try again",
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

  return (
    <>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
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
                <Input type="text" {...field} />
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
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
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
                        {/* <button
                          className="rounded-full bg-white p-1 z-10 absolute right-0 bottom-0"
                          type="button"
                          // onClick={() => removePaper(paper)}
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
                  onChange={handleImgUpload}
                />
              </FormControl>
              <FormMessage>{passportError}</FormMessage>
            </FormItem>
          )}
        />
      </div>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-8 sm:space-y-0">
        <FormField
          control={form.control}
          name="bankAccountDetail.bankName"
          render={({ field }) => (
            <FormItem className="w-full space-y-0">
              <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                Bank Name
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
          name="bankAccountDetail.accountNumber"
          render={({ field }) => (
            <FormItem className="w-full space-y-0">
              <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                Bank Accont No.
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-3 h-3 ml-1" />
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent>
                    <p>Select a category</p>
                    <TooltipArrow />
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </TooltipProvider>
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
    </>
  );
}
