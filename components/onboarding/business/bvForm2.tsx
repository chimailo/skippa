import { useEffect, useState } from "react";
import useSWR from "swr";
import { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import $api from "@/lib/axios";
import { HelpCircle } from "lucide-react";

export interface SocMedia {
  name: "twitter" | "facebook" | "instagram";
  handle: string;
}

type FormDataType = UseFormReturn<
  {
    billingEmail: string;
    supportEmail?: string;
    tin: string;
    registrationNumber: string;
    deliveryCategory: [string, ...string[]];
    bankAccountDetail: {
      bankName: string;
      accountNumber: string;
    };
    directorDetail: {
      idNumber: string;
      idType: string;
      image: string;
      firstName: string;
      lastName: string;
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
  undefined
>;

type Props = {
  form: FormDataType;
  setSocMedia: React.Dispatch<React.SetStateAction<Record<string, SocMedia>>>;
  socMedia: Record<string, SocMedia>;
};

const CATEGORIES = ["motorcycle", "car", "van", "truck"];

export default function BusinessVerificationForm2({
  form,
  socMedia,
  setSocMedia,
}: Props) {
  const [socialMediaFormCount, setSocialMediaFormCount] = useState(1);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const { data } = useSWR(`/options/countries`, () =>
    $api({ url: `/options/countries` })
  );

  useEffect(() => {
    if (data) {
      const countries = data.data;
      const states = data.data[0].states;

      setCountries(countries);
      setStates(states);
    }
  }, [data]);

  const handleAddSocialMedia = () => {
    if (socialMediaFormCount === 3) return;
    setSocialMediaFormCount(socialMediaFormCount + 1);
  };

  const handleRemoveSocialMedia = () => {
    if (socialMediaFormCount === 1) return;
    setSocialMediaFormCount(socialMediaFormCount - 1);
  };

  return (
    <>
      <div className="block md:grid md:grid-cols-2 gap-3 space-y-8 md:space-y-0">
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
                        onValueChange={(e) =>
                          setSocMedia({
                            ...socMedia,
                            [k]: {
                              ...socMedia[k],
                              name: e,
                            },
                          })
                        }
                        defaultValue=""
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
                        onChange={(e) =>
                          setSocMedia({
                            ...socMedia,
                            [k]: {
                              ...socMedia[k],
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
              onClick={handleAddSocialMedia}
            >
              +
            </Button>
            <Button
              variant="outline"
              className="w-6 h-6 flex items-center justify-center text-lg leading-none"
              type="button"
              onClick={handleRemoveSocialMedia}
            >
              -
            </Button>
          </div>
        </div>
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
              <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5">
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
      <h2 className="font-semibold text-sm">Office Address</h2>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-8 sm:space-y-0">
        <div className="grid grid-cols-3 gap-2">
          <FormField
            control={form.control}
            name="addressDetail.flatNumber"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">Flat Number</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
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
                  <Input type="text" {...field} />
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
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-8 sm:space-y-0">
        <div className="grid grid-cols-3 gap-2">
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
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressDetail.street"
            render={({ field }) => (
              <FormItem className="w-full col-span-2">
                <FormLabel className="">
                  Street
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
        <div className="block sm:grid grid-cols-2 gap-2 space-y-6 sm:space-y-0">
          <FormField
            control={form.control}
            name="addressDetail.subStreet"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">Substreet</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
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
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-8 sm:space-y-0">
        <FormField
          control={form.control}
          name="addressDetail.state"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                State
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormLabel>
                Country
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
    </>
  );
}
