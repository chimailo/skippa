import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CalendarIcon, Edit2, Plus, Upload, X } from "lucide-react";
import { format } from "date-fns";

import { Avatar, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { cn, validatePaper, validatePassport } from "@/app/utils";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Papers } from "../../page";

type FormData = UseFormReturn<
  {
    vehicleNumber: string;
    driversLicense: string;
    dateOfBirth: Date;
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
    addressDetail: {
      flatNumber: string;
      landmark: string;
      buildingNumber: string;
      buildingName: string;
      street: string;
      subStreet: string;
      country: string;
      state: string;
      city: string;
    };
  },
  any,
  undefined
>;

type Props = {
  form: FormData;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  imgFile?: File;
  setPapers: React.Dispatch<React.SetStateAction<Papers[]>>;
  papers: Papers[];
};

const CATEGORIES = ["motorcycle", "car", "van", "truck"];

export default function BusinessVerificationForm1(props: Props) {
  const { form, papers, setPapers, imgFile, setFile } = props;
  const [passport, setPassport] = useState<string>();
  const [passportError, setPassportError] = useState<string>();
  const [vPapers, setVPapers] = useState<File[]>([]);
  const [vPapersError, setVPaperError] = useState<string>();

  const dateTo = new Date().getFullYear() - 18;
  const dateFrom = new Date().getFullYear() - 70;
  const defaultMonth = new Date(dateTo, new Date().getMonth());

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);

    if (file) {
      const err = validatePassport(file);

      if (err) {
        setPassportError(err);
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPassport(reader.result as string);
        setFile(file);
      });
      reader.readAsDataURL(file);
    }
  };

  const handlePaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);

    if (file) {
      const err = validatePaper(file);

      if (err) {
        setVPaperError(err);
        return;
      }

      const fileExists = papers.find((paper) => paper.name === file.name);

      if (fileExists) {
        setVPaperError(`${file.name} file already exists`);
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPapers([
          ...papers,
          {
            data: reader.result as string,
            type: file.type,
            name: file.name,
          },
        ]);
      });

      setVPapers([...vPapers, file]);
    }
  };

  const removePaper = (paper: File) => {
    const papersArr = papers.filter((p, i) => paper.name !== p.name);
    const vpapersArr = vPapers.filter((p, i) => paper.name !== p.name);
    setPapers(papersArr);
    setVPapers(vpapersArr);
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
              <FormLabel className="">
                Vehicle Papers
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
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
                          {Math.round(paper.size / 1024)}kb
                        </p>
                        <button
                          className="rounded-full bg-white p-1 z-10 absolute right-0 bottom-0"
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
                <FormLabel className="text-xs py-1 w-full flex flex-col items-center bg-gray-100/40 hover:bg-gray-100 transition-colors gap-1 border border-dashed rounded-lg">
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
              <FormLabel className="">
                Passport Photo
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
              {imgFile ? (
                <div className="flex items-center gap-3">
                  <Avatar className="rounded-none relative">
                    <AvatarImage src={passport} />
                    <FormLabel className="absolute inset-0 bg-transparent hover:bg-black/10 transition-colors block w-full"></FormLabel>
                    <span className="rounded-full bg-white p-1 absolute right-0 bottom-0">
                      <Edit2 className="w-2 h-2" />
                    </span>
                  </Avatar>
                  <span className="text-xs text-gray-600">
                    <p className="mb-1 font-medium">{imgFile.name}</p>
                    <p className="font-medium">
                      {Math.round(imgFile.size / 1024)}kb
                    </p>
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
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-8 sm:space-y-0">
        <FormField
          control={form.control}
          name="bankAccountDetail.bankName"
          render={({ field }) => (
            <FormItem className="w-full space-y-0">
              <FormLabel className="">Bank Name</FormLabel>
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
              <FormLabel className="">Bank Accont No.</FormLabel>
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
          <FormItem className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 space-y-0 lg:grid-cols-4 gap-3">
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
