import { render } from "@testing-library/react";
import StoriesList from "@/pages/stories";
import "@testing-library/jest-dom";
import useFetchStories from "../../../src/common/useFetchStories";
import { firstTen, secondTen } from "./stories.json";
import { Story } from "@/common/types";

jest.mock("../../../src/common/useFetchStories");

const mockUseFetchStories = useFetchStories as jest.MockedFunction<
  typeof useFetchStories
>;
mockUseFetchStories.mockReturnValue({
  loading: true,
  error: false,
  hasMore: false,
  stories: [],
});

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn,
    unobserve: jest.fn,
    disconnect: jest.fn,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe("Stories", () => {
  it("renders the page unchanged", () => {
    const { container } = render(<StoriesList />);
    expect(container).toMatchSnapshot();
  });

  it("renders stories list container and spinner initially", () => {
    mockUseFetchStories.mockReturnValue({
      loading: true,
      error: false,
      hasMore: false,
      stories: [],
    });
    const { queryByTestId } = render(<StoriesList />);
    const listContainer = queryByTestId("list-container");
    expect(listContainer).toBeInTheDocument();
    const spinnerContainer = queryByTestId("spinner-container");
    expect(spinnerContainer).toBeInTheDocument();
  });

  it("renders 10 stories after loading", () => {
    mockUseFetchStories.mockReturnValue({
      loading: false,
      error: false,
      hasMore: false,
      stories: firstTen as Story[],
    });
    const { queryByTestId, getAllByTestId } = render(<StoriesList />);
    const storyItems = getAllByTestId("story-item");
    expect(storyItems.length).toEqual(10);
    const spinnerContainer = queryByTestId("spinner-container");
    expect(spinnerContainer).not.toBeInTheDocument();
  });

  it("renders loading when user reaches the last story", () => {
    mockUseFetchStories.mockReturnValue({
      loading: true,
      error: false,
      hasMore: false,
      stories: firstTen as Story[],
    });
    const { queryByTestId, getAllByTestId } = render(<StoriesList />);
    const storyItems = getAllByTestId("story-item");
    expect(storyItems.length).toEqual(10);
    const spinnerContainer = queryByTestId("spinner-container");
    expect(spinnerContainer).toBeInTheDocument();
  });

  it("renders next 10 stories when user reaches the last story", () => {
    mockUseFetchStories.mockReturnValue({
      loading: false,
      error: false,
      hasMore: false,
      stories: [...firstTen, ...secondTen] as Story[],
    });
    const { queryByTestId, getAllByTestId } = render(<StoriesList />);
    const storyItems = getAllByTestId("story-item");
    expect(storyItems.length).toEqual(20);
    const spinnerContainer = queryByTestId("spinner-container");
    expect(spinnerContainer).not.toBeInTheDocument();
  });
});
