import React, {
  useRef,
  useState,
  FC,
  FunctionComponent,
  Children,
  isValidElement,
  cloneElement,
  ReactNode,
  forwardRef
} from "react";
import { motion, AnimatePresence } from "framer-motion";

type TProps = {
  children: React.ReactNode;
};

function TabContainer({ children }: TProps) {
  const [value, setValue] = useState(0);
  const childRefs = useRef(new Map());
  const tabListRef = useRef();

  console.log(tabListRef);

  const handleClick = (idx: number) => {
    setValue(idx);
  };

  const iterateOverChildren = (
    reactChildren: ReactNode,
    parent: "TabList" | "TabContent"
  ): ReactNode => {
    return Children.map(reactChildren, (child, idx) => {
      if (!isValidElement(child)) return child;

      const props: { [x: string]: unknown } = {
        ...child.props
      };

      if (parent === "TabList") {
        return cloneElement(child, {
          ...props,
          onClick: () => handleClick(idx),
          isActive: idx === value,
          children: iterateOverChildren(
            child.props.children as ReactNode,
            parent
          )
        });
      }
      if (parent === "TabContent") {
        return cloneElement(child, {
          ...props,
          isActive: idx === value,
          children: iterateOverChildren(
            child.props.children as ReactNode,
            parent
          )
        });
      }

      return cloneElement(child, {
        ...props,
        children: iterateOverChildren(child.props.children as ReactNode, parent)
      });
    });
  };

  const renderChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const props: { [x: string]: unknown } = {
      ...child.props
    };

    const childType =
      (child.props.originalType as FunctionComponent) ||
      (child.type as FunctionComponent);
    const name = childType.displayName || childType.name;

    if (name === "TabList") {
      return cloneElement(child, {
        ...props,
        children: iterateOverChildren(child.props.children as ReactNode, name)
      });
    }
    if (name === "TabContent") {
      return cloneElement(child, {
        ...props,
        activeIdx: value,
        children: iterateOverChildren(child.props.children as ReactNode, name)
      });
    }
  });

  return <div className="tab-container">{renderChildren}</div>;
}

const TabList = ({ children }: TProps) => {
  return <div style={{ display: "flex" }}>{children}</div>;
};

type TabProps = TProps & {
  onClick: () => void;
  isActive: boolean;
};

const Tab = ({ children, onClick, isActive }: TabProps) => {
  return (
    <button onClick={onClick} className={isActive ? "selected" : ""}>
      {children}
      {isActive ? (
        <motion.div className="underline" layoutId="underline" />
      ) : null}
    </button>
  );
};

type ContentProps = TProps & {
  activeIdx: number;
};

function TabContent({ children, activeIdx }: ContentProps) {
  const childArr = Children.toArray(children);
  const activeChild = childArr.find((_el, i) => i === activeIdx);
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key={activeIdx}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 0, opacity: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {activeChild}
      </motion.div>
    </AnimatePresence>
  );
}

type PaneProps = TProps & {
  isActive: boolean;
};

function TabPane({ children, isActive }: PaneProps) {
  return (
    <div
      style={{
        background: isActive ? "red" : "transparent",
        marginTop: "30px"
      }}
    >
      {children}
    </div>
  );
}

export { TabContainer, TabList, Tab, TabContent, TabPane };
