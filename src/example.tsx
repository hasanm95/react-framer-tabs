import { TabContainer, TabList, Tab, TabContent, TabPane } from "./tabs";

export default function App() {
  return (
    <TabContainer>
      <TabList>
        <Tab>Home</Tab>
        <Tab>Profile</Tab>
        <Tab>Contact</Tab>
      </TabList>
      <TabContent>
        <TabPane>Home Tab</TabPane>
        <TabPane>Profile Tab</TabPane>
        <TabPane>Contact Tab</TabPane>
      </TabContent>
    </TabContainer>
  );
}
