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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

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

export default function BusinessVerificationForm2({
  form,
}: {
  form: FormDataType;
}) {
  return (
    <>
      <h2 className="font-semibold text-sm">Director&apos;s Details</h2>
      <div className="block sm:flex items-start gap-3 space-y-6 sm:space-y-0">
        <FormField
          control={form.control}
          name="directorDetail.firstName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">
                First Name
                <span className="text-red-600 text-xs">*</span>
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
                Last Name
                <span className="text-red-600 text-xs">*</span>
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
              <FormLabel>Director’s ID Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="national_id">National ID</SelectItem>
                  <SelectItem value="pvc">Permanent Voters Card</SelectItem>
                  <SelectItem value="intl_passport">
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
                <span className="text-red-600 text-xs">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <h2 className="font-semibold text-sm">Address Details</h2>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
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
                <span className="text-red-600 text-xs">*</span>
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
        <div className="grid grid-cols-3 gap-2">
          <FormField
            control={form.control}
            name="addressDetail.buildingNumber"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">
                  Building Number
                  <span className="text-red-600 text-xs">*</span>
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
                  <span className="text-red-600 text-xs">*</span>
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
                  LGA
                  <span className="text-red-600 text-xs">*</span>
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
      <div className="block sm:flex items-start gap-3 space-y-6 sm:space-y-0">
        <FormField
          control={form.control}
          name="addressDetail.state"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">
                State
                <span className="text-red-600 text-xs">*</span>
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
          name="addressDetail.country"
          render={({ field }) => (
            <FormItem className="w-full col-span-2">
              <FormLabel className="">
                Country
                <span className="text-red-600 text-xs">*</span>
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
