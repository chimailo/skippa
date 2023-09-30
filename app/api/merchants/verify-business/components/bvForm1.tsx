"use client";

import { Input } from "@/app/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/app/components/ui/checkbox";

type FormDataType = UseFormReturn<
  {
    billingEmail: string;
    tin: string;
    registrationNumber: string;
    socialMedia: {
      twitter: string;
      facebook: string;
      instagram: string;
    };
    deliveryCategory: string[];
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

const CATEGORIES = ["motorcycle", "car", "van", "truck"];
const SOC_MEDIA_TYPES = ["twitter", "facebook", "instagram"];

export default function BusinessVerificationForm1({
  form,
}: {
  form: FormDataType;
}) {
  return (
    <>
      <div className="block md:flex items-start gap-3 space-y-6 md:space-y-0">
        <FormField
          control={form.control}
          name="billingEmail"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">
                Billing Email
                <span className="text-red-600 text-xl">*</span>
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
                <span className="text-red-600 text-xl">*</span>
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
          name="tin"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">
                Tax Identification Number
                <span className="text-red-600 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-6 md:space-y-8">
          <FormLabel className="font-semibold">
            Categories
            <span className="text-red-600 text-xl">*</span>
          </FormLabel>
          <FormItem className="grid grid-cols-2 gap-3">
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
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
        <div className="space-y-6 md:space-y-8">
          <h2 className="font-semibold text-sm">Bank Details</h2>
          <FormField
            control={form.control}
            name="bankAccountDetail.bankName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">
                  Bank Name
                  <span className="text-red-600 text-xl">*</span>
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
              <FormItem className="w-full">
                <FormLabel className="">
                  Bank Accont No.
                  <span className="text-red-600 text-xl">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-6 md:space-y-8">
          <h2 className="font-semibold text-sm">Social Media</h2>
          {SOC_MEDIA_TYPES.map((medium) => (
            <div key={medium} className="grid grid-cols-3 gap-2">
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="text"
                    disabled
                    value={medium}
                    className="capitalize"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormField
                control={form.control}
                name={`socialMedia${medium}`}
                render={({ field }) => (
                  <FormItem className="w-full col-span-2">
                    <FormControl>
                      <Input type="text" placeholder="Handle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
