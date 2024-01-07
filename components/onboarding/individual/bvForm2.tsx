import { useState, useEffect } from "react";
import useSWR from "swr";
import { UseFormReturn } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import $api from "@/lib/axios";

type FormData = UseFormReturn<
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

export default function IndividualVerificationForm2({
  form,
}: {
  form: FormData;
}) {
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

  return (
    <>
      <h2 className="font-semibold text-sm">Address Details</h2>
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
      <h2 className="font-semibold text-sm">Guarantor&apos;s Details:</h2>
      <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-8 sm:space-y-0">
        <FormField
          control={form.control}
          name="guarantorDetail.firstName"
          render={({ field }) => (
            <FormItem className="w-full space-y-0">
              <FormLabel className="">
                First Name
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
          name="guarantorDetail.lastName"
          render={({ field }) => (
            <FormItem className="w-full space-y-0">
              <FormLabel className="">
                Last Name
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
        <FormField
          control={form.control}
          name="guarantorDetail.email"
          render={({ field }) => (
            <FormItem className="w-full space-y-0">
              <FormLabel className="">
                Email
                <span className="text-red-600 text-xl leading-none">*</span>
              </FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
