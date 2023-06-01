import React, { FC, useEffect, useState } from "react";
import { SavedBudgets } from "./SavedBudgets";
import { Budget } from "../types/types";

export const BudgetRow: FC = () => {
  const [market, setMarket] = useState(0);
  const [development, setDevelopment] = useState(0);
  const [sell, setSell] = useState(0);

  const [savedBudgets, setSavedBudgets] = useState(Array<Budget>);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const storedBudgets = localStorage.getItem("Budgets");
    if (storedBudgets == null || savedBudgets.length !== 0) return;
    setSavedBudgets(JSON.parse(storedBudgets));
  }, [savedBudgets.length]);

  const max = 1200000;
  const totalAllocated = market + development + sell;

  const checkOnChangeAmount = (
    newValue: number,
    oldValue: number,
    updateState: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const diff = oldValue - newValue;
    if (newValue > oldValue) {
      if (totalAllocated < max)
        if (totalAllocated - diff <= max) updateState(newValue);
        else updateState(max - (totalAllocated - oldValue));
    } else updateState(newValue);
  };

  const handleSaveBudget = () => {
    let budgets: Budget[];

    if (editIndex === -1)
      budgets = [...savedBudgets, { market, development, sell }];
    else {
      budgets = [...savedBudgets];
      budgets[editIndex] = { market, development, sell };
      setEditIndex(-1);
    }
    setSavedBudgets(budgets);
    localStorage.setItem("Budgets", JSON.stringify(budgets));
  };

  const handleRemoveBudget = (budgetIndex: number) => {
    const budgets = [...savedBudgets];
    budgets.splice(budgetIndex, 1);
    setSavedBudgets(budgets);
    localStorage.setItem("Budgets", JSON.stringify(budgets));
  };

  const handleEditBudget = (budgetIndex: number) => {
    setEditIndex(budgetIndex);
    setDevelopment(savedBudgets[budgetIndex].development);
    setMarket(savedBudgets[budgetIndex].market);
    setSell(savedBudgets[budgetIndex].sell);
  };

  const clearBudget = () => {
    setEditIndex(-1);
    setDevelopment(0);
    setMarket(0);
    setSell(0);
  };

  return (
    <>
      <div className="grid grid-cols-3">
        <div className="col-span-1 p-3 text-left border-black border-y-2 border-l-2 h-auto max-h-60">
          <h2 className="text-2xl pb-5 text-center font-bold">
            {editIndex !== -1 ? "Edit saved budget" : "New budget"}
          </h2>
          <div className="grid grid-cols-2">
            <input
              className="mr-10"
              type="range"
              min={0}
              value={market}
              onChange={(event) =>
                checkOnChangeAmount(
                  parseInt(event.target.value),
                  market,
                  setMarket
                )
              }
              max={max}
              step={1000}
            />
            <label>Market: {market} kr</label>
          </div>
          <div className="grid grid-cols-2 ">
            <input
              className="mr-10"
              type="range"
              min={0}
              value={development}
              onChange={(event) =>
                checkOnChangeAmount(
                  parseInt(event.target.value),
                  development,
                  setDevelopment
                )
              }
              max={max}
              step={1000}
            />
            <label>Development: {development} kr</label>
          </div>

          <div className="grid grid-cols-2">
            <input
              className="mr-10"
              type="range"
              min={0}
              value={sell}
              onChange={(event) =>
                checkOnChangeAmount(parseInt(event.target.value), sell, setSell)
              }
              max={max}
              step={1000}
            />
            <label>Sales: {sell} kr</label>
          </div>
          <div className="flex pt-5 justify-center place-items-center">
            <p>Total allocated amount: {totalAllocated} kr</p>
            <button
              className="bg-blue-500 disabled:opacity-50 rounded ml-5 p-2 text-white"
              disabled={totalAllocated < max}
              onClick={() => handleSaveBudget()}
            >
              Save budget
            </button>
            {editIndex !== -1 ? (
              <button
                className="bg-blue-500 rounded ml-5 p-2 text-white"
                onClick={() => clearBudget()}
              >
                Cancel edit mode
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <SavedBudgets
          budgets={savedBudgets}
          handleRemoveBudget={handleRemoveBudget}
          handleEditBudget={handleEditBudget}
          editIndex={editIndex}
        />
      </div>
    </>
  );
};