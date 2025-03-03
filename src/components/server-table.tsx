"use client";

import {
  addServer,
  deleteServer,
  getServers,
  updateServer,
} from "@/lib/actions";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import CheckIcon from "./icons/check-icon";
import CloseIcon from "./icons/close-icon";
import PencilIcon from "./icons/pencil-icon";
import PlusIcon from "./icons/plus-icon";
import TrashIcon from "./icons/trash-icon";

export default function ServerTable() {
  const [items, setItems] = useState<ServerItem[]>([]);
  const [newItem, setNewItem] = useState<ServerItem>({
    id: 0,
    name: "",
    host: "",
    port: 0,
  });

  const refresh = useCallback(() => {
    getServers().then(setItems);
  }, []);

  const handleUpdate = (item: ServerItem) => {
    const { id, ...data } = item;
    updateServer(id, data).then(refresh);
  };
  const handleCreate = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = newItem;
    addServer(data).then(refresh);
  };
  const handleDelete = (id: number) => {
    deleteServer(id).then(refresh);
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <table className="table table-zebra">
      <thead>
        <tr>
          <th>Name</th>
          <th>Host</th>
          <th>Port</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <EditableItem
            key={item.id}
            item={item}
            onSubmit={handleUpdate}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
        <EditItem
          item={newItem}
          submitText={
            <>
              <PlusIcon />
              Add Server
            </>
          }
          onChange={(data) => setNewItem((prev) => ({ ...prev, ...data }))}
          onSubmit={handleCreate}
        />
      </tbody>
    </table>
  );
}

interface EditableItemProps {
  item: ServerItem;
  onSubmit: (data: ServerItem) => void;
  onDelete: () => void;
}
function EditableItem({ item, onSubmit, onDelete }: EditableItemProps) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState<ServerItem>(() => ({ ...item }));

  const handleDiscard = () => {
    setDraft({ ...item });
    setEdit(false);
  };

  const handleSubmit = () => {
    if (
      draft.name === item.name &&
      draft.host === item.host &&
      draft.port === item.port
    ) {
      handleDiscard();
    } else {
      onSubmit(draft);
      setEdit(false);
    }
  };

  if (!edit) {
    return (
      <tr className="group">
        <td>{item.name}</td>
        <td>{item.host}</td>
        <td>{item.port}</td>
        <td>
          <button
            className="btn btn-circle btn-sm btn-ghost"
            onClick={() => setEdit(true)}
          >
            <PencilIcon />
          </button>
          <button
            className="btn btn-circle btn-sm btn-ghost"
            onClick={onDelete}
          >
            <TrashIcon />
          </button>
        </td>
      </tr>
    );
  }

  return (
    <EditItem
      item={draft}
      onChange={(data) => setDraft((prev) => ({ ...prev, ...data }))}
      onSubmit={handleSubmit}
      onDiscard={handleDiscard}
    />
  );
}

interface EditItemProps {
  item: ServerItem;
  submitText?: React.ReactNode;
  onChange: (data: Partial<ServerItem>) => void;
  onSubmit: () => void;
  onDiscard?: () => void;
}
function EditItem({
  item,
  submitText,
  onChange,
  onSubmit,
  onDiscard,
}: EditItemProps) {
  return (
    <tr>
      <td>
        <input
          className="input input-sm"
          value={item.name}
          placeholder="Server name"
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </td>
      <td>
        <input
          className="input input-sm"
          value={item.host}
          placeholder="Server host"
          onChange={(e) => onChange({ host: e.target.value })}
        />
      </td>
      <td>
        <input
          className="input input-sm"
          value={item.port}
          type="number"
          placeholder="Server port"
          onChange={(e) =>
            !isNaN(e.target.value as any) &&
            onChange({ port: parseInt(e.target.value) })
          }
        />
      </td>
      <td>
        <button
          className={clsx(
            "btn btn-sm",
            submitText ? "btn-primary" : "btn-circle btn-ghost",
          )}
          onClick={onSubmit}
        >
          {submitText ?? <CheckIcon />}
        </button>
        {onDiscard && (
          <button
            className="btn btn-circle btn-sm btn-ghost"
            onClick={onDiscard}
          >
            <CloseIcon />
          </button>
        )}
      </td>
    </tr>
  );
}

export interface ServerItem {
  id: number;
  name: string;
  host: string;
  port: number;
}
