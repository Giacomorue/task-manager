"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Plus, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "./ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface TaskFormProps {
  isUpdate?: boolean;
  initialData?: {
    id: string;
    name: string;
    description: string;
  };
}

function TaskForm({ isUpdate, initialData }: TaskFormProps) {
  const inputNomeRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { mutate: addTask } = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/task/create`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsOpen(false);
      toast({
        title: "Task aggiunto",
        description: "Il task è stato aggiunto con successo",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Errore",
        description:
          error.response?.data?.message || "Si è verificato un errore",
      });
    },
  });

  const { mutate: updateTask } = useMutation({
    mutationFn: (data: any) =>
      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/task/update/${initialData?.id}`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsOpen(false);
      toast({
        title: "Task aggiornato",
        description: "Il task è stato aggiornato con successo",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Errore",
        description:
          error.response?.data?.message || "Si è verificato un errore",
      });
    },
  });

  const form = useForm({
    defaultValues: {
      name: isUpdate ? initialData?.name : "",
      description: isUpdate ? initialData?.description : "",
    },
  });

  const onSubmit = (data: any) => {
    if (isUpdate) {
      updateTask(data);
    } else {
      addTask(data);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: isUpdate ? initialData?.name : "",
        description: isUpdate ? initialData?.description : "",
      });
      inputNomeRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div className="w-full flex flex-row items-center justify-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {!isUpdate ? (
            <Button className="">
              Aggiungi Task
              <Plus className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isUpdate ? "Aggiorna Task" : "Aggiungi Task"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {isUpdate
              ? "Aggiorna il task per gestire il tuo progetto"
              : "Aggiungi un nuovo task per gestire il tuo progetto"}
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} ref={inputNomeRef} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">
                {isUpdate ? "Aggiorna" : "Aggiungi"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TaskForm;
