import React, {useEffect, useMemo} from "react";

const ingredientList = [
  {name: "flour", measurement: "375g"},
  {name: "salt", measurement: "1.5 teaspoons"},
  {name: "butter", measurement: "275g"},
  {name: "water", measurement: "1/4 cup"},
  {name: "plums", measurement: "3 pounds"},
  {name: "brown sugar", measurement: "145g"},
  {name: "orange", measurement: "1 Small Orange"},
  {name: "cornstarch", measurement: "1/4 cup"},
  {name: "sugar", measurement: "2 tablespoons"},
  {name: "egg", measurement: "1 egg yolk"},
  {name: "cream", measurement: "1 tablespoon"},
  {name: "cinnamon", measurement: "1"},
];

type Props = {
  phrase: string;
};

export const Ingredients: React.FC<Props> = ({phrase}) => {
  const mentionedIngredients = useMemo(() => {
    return ingredientList.filter((element) => {
      if (phrase.toLowerCase().indexOf(element.name) != -1) {
        return true;
      }
      return false;
    });
  }, [phrase]);

  return (
    <>
      <div className="grid grid-cols-2 text-lg px-8 py-8 mb-auto">
        {mentionedIngredients.map((item) => (
          <>
            <div>{item.name}</div>
            <div>{item.measurement}</div>
          </>
        ))}
      </div>
    </>
  );
};
