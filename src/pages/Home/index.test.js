import { fireEvent, render, screen, within, act } from "@testing-library/react";
import DataContext from "../../contexts/DataContext";
import Home from "./index";
import events from "../../data/events.json";
import Slider from "../../containers/Slider";

const providerValue = { data: events };
const providerValueWithFocus = { data: { focus: events.events } };

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    // Check if all form fields are rendered
    expect(await screen.findByText("Email")).toBeInTheDocument();
    expect(await screen.findByText("Nom")).toBeInTheDocument();
    expect(await screen.findByText("Prénom")).toBeInTheDocument();
    expect(
      await screen.findByText("Personel / Entreprise")
    ).toBeInTheDocument();
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      expect(await screen.findByText("En cours")).toBeInTheDocument();
      expect(await screen.findByText("Message envoyé !")).toBeInTheDocument();
    });
  });
});

describe("When a page is created", () => {
  it("changes image after a few seconds in the carousel", async () => {
    jest.useFakeTimers();

    render(
      <DataContext.Provider value={providerValueWithFocus}>
        <Slider />
      </DataContext.Provider>
    );

    // Get all images inside the carousel
    const images = screen.getAllByRole("img");

    // At first render → the first image should be visible
    expect(images[0]).toBeVisible();

    // Fast-forward time by 5 seconds (AUTOPLAY_MS)
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // After advancing time → the second image should now be visible
    const imagesAfter = screen.getAllByRole("img");
    expect(imagesAfter[1]).toBeVisible();
  });
  it("a list of events is displayed", async () => {
    render(
      <DataContext.Provider value={providerValue}>
        <Home />
      </DataContext.Provider>
    );
    // use role to target the heading only
    expect(
      await screen.findByRole("heading", { name: "Nos réalisations" })
    ).toBeInTheDocument();
    expect(await screen.findByText(events.events[0].title)).toBeInTheDocument();
  });
  it("a list a people is displayed", () => {
    render(
      <DataContext.Provider value={providerValue}>
        <Home />
      </DataContext.Provider>
    );
    expect(screen.getByText("Samira")).toBeInTheDocument();
    expect(screen.getByText("Jean-baptiste")).toBeInTheDocument();
  });
  // target the footer specifically
  it("a footer is displayed", async () => {
    render(
      <DataContext.Provider value={providerValue}>
        <Home />
      </DataContext.Provider>
    );
    expect(
      await screen.findByText("Notre dernière prestation")
    ).toBeInTheDocument();
  });
  it("displays envent details in modal when an envent is clicked", async () => {
    render(
      <DataContext.Provider value={providerValue}>
        <Home />
      </DataContext.Provider>
    );
    const eventCard = await screen.findByText(events.events[0].title);
    fireEvent.click(eventCard);
    expect(
      await screen.findByText(events.events[0].description)
    ).toBeInTheDocument();
  });
  it("an event card, with the last event, is displayed", async () => {
    render(
      <DataContext.Provider value={providerValue}>
        <Home />
      </DataContext.Provider>
    );
    const latestEvent = [...events.events].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0];
    // Restrict search to footer, since that's where the "last event" card is
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(latestEvent.title)).toBeInTheDocument();
  });
});
