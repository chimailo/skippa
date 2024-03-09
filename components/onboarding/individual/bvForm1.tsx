import { useEffect, useState } from "react";
import useSWR from "swr";
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
import {
  cn,
  dobRange,
  isObjectEmpty,
  validatePaper,
  validatePassport,
} from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/spinner";
import $api from "@/lib/axios";

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
    deliveryCategory: string[];
    bankAccountDetail: {
      bankName: string;
      accountNumber: string;
    };
    vehiclePapers: Array<{
      vehiclePaperImages: string;
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
  form: FormDataType;
  passport: Record<string, string>;
  vPapers: Record<string, string>[];
  setPassport: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setVPapers: React.Dispatch<React.SetStateAction<Record<string, string>[]>>;
};

const CATEGORIES = ["motorcycle", "car", "van", "truck"];

const uploadFiles = async (form: FormData, type: string = "media") => {
  return await fetch(`${process.env.baseUrl}/upload/${type}`, {
    method: "POST",
    body: form,
  });
};

export default function BusinessVerificationForm1(props: Props) {
  const { form, passport, setPassport, vPapers, setVPapers } = props;

  const [isPaperUploading, setPaperUploading] = useState(false);
  const [isImageUploading, setImageUploading] = useState(false);
  const [passportError, setPassportError] = useState<string>();
  const [vPapersError, setVPaperError] = useState<string>();
  const [banks, setBanks] = useState([]);
  // const [passport, setPassport] = useState<Record<string, string>>();
  // const [vPapers, setVPapers] = useState<Record<string, string>[]>([]);

  const { toast } = useToast();
  const { dateFrom, dateTo, defaultMonth } = dobRange();

  const { data } = useSWR(`/options/banks`, () =>
    $api({ url: `/options/banks` })
  );

  useEffect(() => {
    if (data) {
      const banks = data.data;

      setBanks(banks);
    }
  }, [data]);

  // useEffect(() => {
  //   const passport: Record<string, string> = JSON.parse(
  //     localStorage.getItem("passport") as string
  //   );
  //   const vPapers: Record<string, string>[] = JSON.parse(
  //     localStorage.getItem("vPapers") as string
  //   );

  //   if (passport) {
  //     setPassport(passport);
  //     form.setValue("image", passport.url);
  //   }

  //   if (vPapers) {
  //     const papers = vPapers.map((paper) => ({
  //       vehiclePaperImages: paper.url,
  //       type: "image",
  //       name: paper.name,
  //     }));
  //     form.setValue("vehiclePapers", papers);
  //     setVPapers(vPapers);
  //   }
  // }, []);

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
        form.setValue("image", image.url, {
          shouldValidate: true,
        });
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
    }
  };

  const handlePaperUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    doc?: string
  ) => {
    const file = e.target.files?.item(0);

    if (!file) return;

    const err = validatePaper(file);

    if (err) {
      setVPaperError(err);
      return;
    }

    // // Remove when done
    // form.setValue(
    //   "image",
    //   "https://res.cloudinary.com/dh3i1wodq/image/upload/v1675417496/cbimage_3_drqdoc.jpg"
    // );

    const fileType = file.type.includes("image") ? "media" : "document";
    const imgForm = new FormData();
    imgForm.append("files", file);

    try {
      setPaperUploading(true);
      const res = await uploadFiles(imgForm, fileType);
      const { data } = await res.json();

      if (!res.ok) {
        toast({
          variant: "destructive",
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

      const p = vPapers.filter((paper) => paper.name !== doc);
      const papers = doc ? [...p, paper] : [...vPapers, paper];
      setVPapers(papers);
      // localStorage.setItem("vPapers", JSON.stringify(papers));
      const papersUrl = papers.map((paper) => ({
        vehiclePaperImages: paper.url as string,
        name: paper.name as string,
        type: "Vehicle Paper",
      }));
      form.setValue("vehiclePapers", papersUrl, {
        shouldValidate: true,
      });

      // Reset input value, incase user selects the same file again
      e.target.value = "";
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
    setVPapers(vpapersArr);

    // try {
    //   setPaperUploading(true);
    //   const res = await deleteFiles(paper.id);
    //   const data = await res.json();
    //   console.log(data);

    //   if (data.result !== "ok") {
    //     toast({
    //       variant: "destructive",
    //       duration: 1000 * 4,
    //       title: "Error",
    //       description: "Failed to delete vehicle paper, please try again",
    //     });
    //     return;
    //   }

    //   // localStorage.setItem("vPapers", JSON.stringify(vpapersArr));
    // } catch (error) {
    //   toast({
    //     duration: 1000 * 4,
    //     variant: "destructive",
    //     title: "Error",
    //     description: "Ooops..., an error has occured, please try again",
    //   });
    // } finally {
    //   setPaperUploading(false);
    // }
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
                <div className="flex gap-3 items-end">
                  <ul className="flex items-center gap-2 flex-wrap">
                    {vPapers.map((paper, i) => (
                      <FormLabel
                        key={i}
                        htmlFor={paper.name}
                        className="transition-colors block h-12 w-24 hover:border-gray-200 hover:border-2 rounded-md text-center px-2 py-1 relative"
                      >
                        <FormControl>
                          <input
                            accept="image/*, application/pdf"
                            id={paper.name}
                            type="file"
                            className="sr-only"
                            onChange={(e) => handlePaperUpload(e, paper.name)}
                          />
                        </FormControl>
                        <p className="mb-1 font-semibold text-xs truncate">
                          {paper.name}
                        </p>
                        <p className="font-medium text-gray-500 text-xs">
                          {paper?.size}
                        </p>
                        <button
                          className="rounded-full bg-white p-0.5 z-10 absolute -left-1 -top-1 border border-red-500"
                          type="button"
                          onClick={() => removePaper(paper)}
                        >
                          <X className="w-3 h-3 fill-red-500" />
                        </button>
                        <span className="rounded-full bg-white p-1 absolute right-0 bottom-0">
                          <Edit2 className="w-2 h-2" />
                        </span>
                      </FormLabel>
                    ))}
                  </ul>
                  {vPapers.length < 4 && (
                    <FormLabel className="w-4 h-4 rounded-full flex items-center flex-shrink-0 justify-center border-2 border-primary">
                      <Plus className="w-3 h-3 text-primary" />
                    </FormLabel>
                  )}
                </div>
              ) : (
                <FormLabel className="text-xs py-1 w-full flex items-center bg-gray-100/40 gap-1 hover:bg-gray-100 transition-colors border border-dashed rounded-lg flex-col">
                  <Upload className="w-3 h-3" />
                  Upload Papers
                </FormLabel>
              )}
              <FormControl>
                <input
                  accept="image/*, application/pdf"
                  type="file"
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
              {!isObjectEmpty(passport) ? (
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
                    <FormLabel className="absolute inset-0 bg-transparent hover:bg-black/10 transition-colors block w-full z-10"></FormLabel>
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
            <FormItem className="w-full">
              <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                Bank Name
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-80">
                  {banks.map((bank: any) => (
                    <SelectItem key={bank.id} value={bank.name}>
                      {bank.name}
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
          name="bankAccountDetail.accountNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                Bank Accont No.
              </FormLabel>
              <FormControl>
                <Input {...field} type="number" inputMode="numeric" />
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
