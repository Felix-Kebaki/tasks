import { MyGoals } from "./components/myGoalsHome/MyGoals";
import { DailyRoutine } from "./components/dailyRoutineHome/DailyRoutine";
import { Navigation } from "./components/navigationHome/Navigation";
import { TeamWork } from "./components/teamWorkHome/TeamWork";
import { HowItWorks } from "./components/whoWeAreHome/HowItWorks";
import { Hero } from "./components/heroHome/Hero";

function App() {
  return (
    <>
      <main className="MainAtApp">
        <Navigation />
        <Hero/>
        <HowItWorks/>
        <DailyRoutine/>
        <MyGoals/>
        <TeamWork/>
      </main>
    </>
  );
}

export default App;
