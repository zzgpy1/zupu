'use client';
interface Node {
  id: string;
  name: string;
  children?: Node[];
}

export default function TreeView({ data }: { data: Node }) {
  return (
    <ul className="list-none pl-4">
      <li>
        <span className="font-semibold">{data.name}</span>
        {data.children && data.children.length > 0 && (
          <ul className="pl-6 border-l-2 border-gray-300 ml-2">
            {data.children.map(child => (
              <TreeView key={child.id} data={child} />
            ))}
          </ul>
        )}
      </li>
    </ul>
  );
}
