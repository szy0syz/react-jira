import React from "react";

/**
 * -> 项目管理中的项目经验是项目成功的关键
 * <- ['项目','项目','项目']
 */

export const Mark = ({ name, keyword }: { name: string; keyword: string }) => {
  if (!keyword) return <>{name}</>;

  const arr = name.split(keyword);

  return (
    <div>
      {arr.map((str: string, index: number) => (
        <span key={index}>
          {str}
          {index === arr.length - 1 ? null : (
            <span style={{ color: "#257AFD" }}>{keyword}</span>
          )}
        </span>
      ))}
    </div>
  );
};
