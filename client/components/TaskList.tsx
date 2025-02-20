"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistance } from "date-fns";
import { it } from "date-fns/locale";
import { Trash, CircleX } from "lucide-react";
import { Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import TaskForm from "./TaskForm";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { PointerSensor } from "@dnd-kit/core";
import { KeyboardSensor } from "@dnd-kit/core";

type Task = {
  id: string;
  name: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/task`
      );
      const tasks = response.data;
      return tasks;
    },
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const sensros = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const { mutate: updateOrder } = useMutation({
    mutationFn: (tasks: Task[]) =>
      axios.put(`${process.env.NEXT_PUBLIC_API_URL}/task/update-order`, {
        tasks,
      }),
    onSuccess: (_, tasks: Task[]) => {
      toast({
        title: "Ordine delle task aggiornato",
        description: "L'ordine delle task è stato aggiornato con successo",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Errore",
        description:
          error.response?.data?.message || "Si è verificato un errore",
      });
      //Set task con l'ordine originale
      setTasks(data || []);
    },
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id && tasks) {
      const oldIndex = tasks.findIndex((task: Task) => task.id === active.id);
      const newIndex = tasks.findIndex((task: Task) => task.id === over.id);
      const newOrder = arrayMove(tasks, oldIndex, newIndex);

      for (let i = 0; i < newOrder.length; i++) {
        newOrder[i].order = i;
      }

      setTasks(newOrder);

      updateOrder(newOrder);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[125px] w-full rounded-lg" />
        ))}
      </div>
    );

  if (isError)
    return (
      <div className="text-red-400 font-semibold text-center pt-10 flex flex-col items-center gap-2">
        <CircleX className="w-10 h-10" />
        Errore nel fetch dei dati
      </div>
    );

  // if (!tasks) return <div>No data</div>;

  return (
    <>
      <TaskForm />
      <div className="flex flex-col gap-4 items-center">
        <DndContext
          sensors={sensros}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map((task: Task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task: Task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

export default TaskList;

function TaskItem({ task }: { task: Task }) {
  const queryClient = useQueryClient();

  const { mutate: deleteTask } = useMutation({
    mutationFn: () =>
      axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/task/delete/${task.id}`),
    onSuccess: () => {
      toast({
        title: "Task eliminato",
        description: "Il task è stato eliminato con successo",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description:
          error.response?.data?.message || "Si è verificato un errore",
      });
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="hover:shadow-lg transition-shadow w-full max-w-[95%] duration-300"
    >
      <CardHeader className="flex flex-row justify-between items-center gap-10">
        <div className="flex flex-col gap-2">
          <CardTitle>{task.name}</CardTitle>
          <CardDescription>{task.description}</CardDescription>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <TaskForm isUpdate initialData={task} />
          <Button variant="destructive" onClick={() => deleteTask()}>
            <Trash />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between md:flex-row">
        <div className="text-sm text-gray-500">
          Creata: {new Date(task.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">
          Aggiornata:{" "}
          {formatDistance(new Date(task.updatedAt), new Date(), {
            addSuffix: true,
            locale: it,
          })}
        </div>
      </CardContent>
    </Card>
  );
}
