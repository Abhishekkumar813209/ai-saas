"use client"
import axios from "axios"
import * as z from 'zod';

import { Download, ImageIcon } from "lucide-react";
import {useForm} from "react-hook-form"
import {amountOptions, formSchema,resolutionOptions} from "./constants"
import { zodResolver } from '@hookform/resolvers/zod';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Heading from "@/components/heading"
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import Empty from "@/components/empty";


import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import toast from "react-hot-toast";


const ImagePage = () => {
    const router = useRouter();
    const [images,setImages] = useState<string[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            prompt:"",
            amount:"1",
            resolution:"512x512"
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values:z.infer<typeof formSchema>)=>{
        try{
   
setImages([]);
const response = await axios.post("/api/image", values);

// Check if the response data is an object with a 'url' property
if (response.data && response.data.url) {
    const imageUrl = response.data.url;
    setImages([imageUrl]); // Wrap the URL in an array for consistency with the previous structure.
    form.reset();}
        }catch(error:any){
            toast.error("Something went wrong")
        } finally{
            router.refresh();
        }
    }

    return ( 
        <div>
            <Heading 
            title="Image Generation"
            description="Turn your prompt into an image. "
            icon= {ImageIcon}
            iconColor="text-pink-700"
            bgColor="bg-pink-700/10"
            />
            <div className="px-4 lg:px-8">
                <Form {...form}>
                   <form
                   onSubmit={form.handleSubmit(onSubmit)}
                   className='
                   rounded-lg
                   border 
                   w-full
                   p-4
                   px-3
                   md:px-6
                   focus-within:shadow-sm
                   grid
                   grid-cols-12
                   gap-2
                   '
                >

                <FormField 
                name="prompt"
                render={({field})=>(
                    <FormItem className='col-span-12 lg:col-span-6'>
                        <FormControl className='m-0 p-0' >
                            <Input 
                            className="border-0 outline-none
                            focus-visible:ring-0
                            focus-visible:ring-transparent"
                            disabled={isLoading}
                            placeholder='A picture of horse in Swiss'
                            {...field}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />

                <FormField
                control = {form.control}
                name="amount"   
                render={({field})=> (
                    <FormItem className="col-span-12 lg:col-span-2">
                        <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue defaultValue={field.value} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {amountOptions.map((option)=>(
                                    <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}             
                />

            <FormField
                control = {form.control}
                name="resolution"   
                render={({field})=> (
                    <FormItem className="col-span-12 lg:col-span-2">
                        <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue defaultValue={field.value} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {resolutionOptions.map((option)=>(
                                    <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}             
                />
                <Button className='col-span-12 lg:col-span-2 w-full disabled={isLoading}'>
                    Generate
                </Button>

                </form> 
                </Form>
            </div>
            <div className="space-y-4 mt-4">
            {
                isLoading && (
                    <div className="p-20">
                        <Loader />
                    </div>
                )
            }

                {images.length === 0 && !isLoading && (
                    <Empty label="No Images Genarated" /> 
                )

                }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3xl:grid-cols-4 gap-4 mt-8">
                    {images.map((src)=>(
                        <Card
                        key={src}
                        className="rounded-lg overflow-hidden"
                        >
                            <div className="relative aspect-squaare">
                                <Image 
                                alt="image"
                                fill
                                src={src}
                                />
                            </div>
                            <CardFooter className="p-2">
                                <Button 
                                onClick={()=>window.open(src)}                                
                                variant="secondary" 
                                className="w-full"
                                >

                                <Download className="h-4 w-4 mr-2" />
                                Download

                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                   <div>
                    Images will be rendered here
                   </div>
            </div>
        </div>
     );
}
 
export default ImagePage;