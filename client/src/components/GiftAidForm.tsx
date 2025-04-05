import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

interface GiftAidFormProps {
  isGiftAid: boolean;
  setIsGiftAid: (value: boolean) => void;
  giftAidName: string;
  setGiftAidName: (value: string) => void;
  giftAidAddress: string;
  setGiftAidAddress: (value: string) => void;
  giftAidPostcode: string;
  setGiftAidPostcode: (value: string) => void;
}

const GiftAidForm: React.FC<GiftAidFormProps> = ({
  isGiftAid,
  setIsGiftAid,
  giftAidName,
  setGiftAidName,
  giftAidAddress,
  setGiftAidAddress,
  giftAidPostcode,
  setGiftAidPostcode
}) => {
  return (
    <Card className="mt-4 mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-1.5">
          <span>Gift Aid Declaration</span>
          <InfoIcon size={16} className="text-gray-400" />
        </CardTitle>
        <CardDescription>
          For UK taxpayers, Gift Aid allows us to claim an extra 25p for every £1 you donate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-2 mb-4">
          <Checkbox
            id="isGiftAid"
            checked={isGiftAid}
            onCheckedChange={(checked) => {
              if (typeof checked === 'boolean') {
                setIsGiftAid(checked);
              }
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="isGiftAid"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I am a UK taxpayer and understand that if I pay less Income Tax and/or Capital Gains Tax than the amount of Gift Aid claimed on all my donations in that tax year it is my responsibility to pay any difference.
            </Label>
          </div>
        </div>

        {isGiftAid && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="giftAidName">Full Name</Label>
              <Input
                id="giftAidName"
                value={giftAidName}
                onChange={(e) => setGiftAidName(e.target.value)}
                placeholder="Your full name"
                required={isGiftAid}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="giftAidAddress">Home Address</Label>
              <Input
                id="giftAidAddress"
                value={giftAidAddress}
                onChange={(e) => setGiftAidAddress(e.target.value)}
                placeholder="Your home address (not your work address)"
                required={isGiftAid}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="giftAidPostcode">Postcode</Label>
              <Input
                id="giftAidPostcode"
                value={giftAidPostcode}
                onChange={(e) => setGiftAidPostcode(e.target.value)}
                placeholder="Your postcode"
                required={isGiftAid}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Please notify us if you want to cancel this declaration, change your name or home address, or no longer pay sufficient tax on your income and/or capital gains.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GiftAidForm;