import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  RefreshCw,
  UserRound,
  GripVertical,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

const emptyAboutForm = {
  title: "",
  short_description: "",
  long_description: "",
  profile_image: "",
};

const emptyCardForm = {
  title: "",
  description: "",
  icon: "",
  display_order: 1,
};

/* =========================================================
   HELPERS
========================================================= */

const isImageUrl = (value) => {
  if (!value || typeof value !== "string") {
    return false;
  }

  const url = value.trim();

  if (!url) {
    return false;
  }

  // Normal image URL
  if (
    /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(
      url
    )
  ) {
    return true;
  }

  // CDN URLs where extension may not exist
  if (
    /^https?:\/\/(images\.|cdn\.|.*cloudinary\.com|.*imgur\.com|.*unsplash\.com)/i.test(
      url
    )
  ) {
    return true;
  }

  // Data URL
  if (/^data:image\//i.test(url)) {
    return true;
  }

  return false;
};

/* =========================================================
   IMAGE PREVIEW
========================================================= */

function ImagePreview({
  src,
  alt = "Image preview",
  size = "small",
  rounded = "rounded-xl",
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || !isImageUrl(src) || hasError) {
    return null;
  }

  const sizeClass =
    size === "large"
      ? "h-40 w-40"
      : size === "medium"
      ? "h-24 w-24"
      : "h-16 w-16";

  return (
    <div
      className={`${sizeClass} ${rounded} overflow-hidden border border-slate-200 bg-slate-100`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

/* =========================================================
   ABOUT PAGE
========================================================= */

export default function About() {
  const [about, setAbout] = useState(null);
  const [cards, setCards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(true);

  const [showAboutForm, setShowAboutForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  const [editingAbout, setEditingAbout] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const [aboutForm, setAboutForm] = useState(emptyAboutForm);
  const [cardForm, setCardForm] = useState(emptyCardForm);

  const [savingAbout, setSavingAbout] = useState(false);
  const [savingCard, setSavingCard] = useState(false);

  const { success, error: showError } = useNotification();

  /* =========================================================
     LOAD MAIN ABOUT
  ========================================================= */

  const loadAbout = async () => {
    try {
      setLoading(true);

      const response = await api.get("/about");

      setAbout(response.data || null);
    } catch (err) {
      if (err.response?.status === 404) {
        setAbout(null);
      } else {
        showError(
          err.response?.data?.detail ||
            "Unable to load About information."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD ABOUT CARDS
  ========================================================= */

  const loadCards = async () => {
    try {
      setCardsLoading(true);

      const response = await api.get("/about/cards");

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      const sortedCards = [...data].sort(
        (a, b) =>
          (a.display_order || 0) -
          (b.display_order || 0)
      );

      setCards(sortedCards);
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to load About cards."
      );
    } finally {
      setCardsLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadAbout();
    loadCards();
  }, []);

  /* =========================================================
     MAIN ABOUT FORM
  ========================================================= */

  const openAddAboutForm = () => {
    setAboutForm({
      ...emptyAboutForm,
    });

    setEditingAbout(false);
    setShowAboutForm(true);
  };

  const openEditAboutForm = () => {
    if (!about) return;

    setAboutForm({
      title: about.title || "",
      short_description:
        about.short_description || "",
      long_description:
        about.long_description || "",
      profile_image:
        about.profile_image || "",
    });

    setEditingAbout(true);
    setShowAboutForm(true);
  };

  const closeAboutForm = () => {
    if (savingAbout) return;

    setShowAboutForm(false);
    setEditingAbout(false);
    setAboutForm({
      ...emptyAboutForm,
    });
  };

  const handleAboutChange = (event) => {
    const { name, value } = event.target;

    setAboutForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAboutSubmit = async (event) => {
    event.preventDefault();

    if (!aboutForm.title.trim()) {
      showError("Title is required.");
      return;
    }

    if (!aboutForm.short_description.trim()) {
      showError("Short description is required.");
      return;
    }

    try {
      setSavingAbout(true);

      const payload = {
        title: aboutForm.title.trim(),
        short_description:
          aboutForm.short_description.trim(),
        long_description:
          aboutForm.long_description.trim() || null,
        profile_image:
          aboutForm.profile_image.trim() || null,
      };

      if (editingAbout) {
        await api.put("/about", payload);

        success(
          "About information updated successfully."
        );
      } else {
        await api.post("/about", payload);

        success(
          "About information added successfully."
        );
      }

      await loadAbout();

      setShowAboutForm(false);
      setEditingAbout(false);
      setAboutForm({
        ...emptyAboutForm,
      });
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to save About information."
      );
    } finally {
      setSavingAbout(false);
    }
  };

  /* =========================================================
     ABOUT CARD FORM
  ========================================================= */

  const openAddCardForm = () => {
    setCardForm({
      ...emptyCardForm,
      display_order: cards.length + 1,
    });

    setEditingCard(null);
    setShowCardForm(true);
  };

  const openEditCardForm = (card) => {
    setCardForm({
      title: card.title || "",
      description: card.description || "",
      icon: card.icon || "",
      display_order: card.display_order || 1,
    });

    setEditingCard(card);
    setShowCardForm(true);
  };

  const closeCardForm = () => {
    if (savingCard) return;

    setShowCardForm(false);
    setEditingCard(null);
    setCardForm({
      ...emptyCardForm,
    });
  };

  const handleCardChange = (event) => {
    const { name, value } = event.target;

    setCardForm((previous) => ({
      ...previous,
      [name]:
        name === "display_order"
          ? Number(value)
          : value,
    }));
  };

  const handleCardSubmit = async (event) => {
    event.preventDefault();

    if (!about) {
      showError(
        "Please add the main About information first."
      );
      return;
    }

    if (!cardForm.title.trim()) {
      showError("Card title is required.");
      return;
    }

    if (!cardForm.description.trim()) {
      showError("Card description is required.");
      return;
    }

    try {
      setSavingCard(true);

      const payload = {
        title: cardForm.title.trim(),
        description: cardForm.description.trim(),
        icon: cardForm.icon.trim() || null,
        display_order:
          Number(cardForm.display_order) || 1,
      };

      if (editingCard) {
        await api.put(
          `/about/cards/${editingCard.id}`,
          payload
        );

        success(
          "About card updated successfully."
        );
      } else {
        await api.post(
          "/about/cards",
          payload
        );

        success(
          "About card added successfully."
        );
      }

      await loadCards();

      setShowCardForm(false);
      setEditingCard(null);
      setCardForm({
        ...emptyCardForm,
      });
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to save About card."
      );
    } finally {
      setSavingCard(false);
    }
  };

  /* =========================================================
     DELETE CARD
  ========================================================= */

  const handleDeleteCard = async (card) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${card.title}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/about/cards/${card.id}`
      );

      success(
        "About card deleted successfully."
      );

      await loadCards();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to delete About card."
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading About information...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="space-y-8">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserRound size={21} />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-600">
                Portfolio Content
              </p>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                About
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your main About content and the
            information cards displayed on your public
            portfolio.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {about ? (
            <button
              type="button"
              onClick={openEditAboutForm}
              className="ios-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Pencil size={17} />
              Edit About
            </button>
          ) : (
            <button
              type="button"
              onClick={openAddAboutForm}
              className="ios-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add About
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              loadAbout();
              loadCards();
            }}
            className="ios-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>
      </div>

      {/* =====================================================
          MAIN ABOUT CONTENT
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Main About Content
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This content is displayed as the main
              introduction in your About section.
            </p>
          </div>

          {about && (
            <button
              type="button"
              onClick={openEditAboutForm}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Pencil size={16} />
              Edit
            </button>
          )}
        </div>

        {about ? (
          <div className="p-5 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
              {/* Image */}

              <div>
                {about.profile_image ? (
                  <div>
                    <div className="h-40 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      <img
                        src={about.profile_image}
                        alt={about.title}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>

                    <a
                      href={about.profile_image}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink size={14} />
                      Open image URL
                    </a>
                  </div>
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
                    <UserRound size={40} />
                  </div>
                )}
              </div>

              {/* Content */}

              <div className="min-w-0">
                <h3 className="text-xl font-bold text-slate-900">
                  {about.title}
                </h3>

                <p className="mt-3 text-sm font-medium leading-6 text-slate-700">
                  {about.short_description}
                </p>

                {about.long_description && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-500">
                    {about.long_description}
                  </p>
                )}

                <div className="mt-5 text-xs text-slate-400">
                  Last updated:{" "}
                  {about.updated_at
                    ? new Date(
                        about.updated_at
                      ).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-14 text-center sm:px-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <UserRound size={24} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900">
              No About information
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your main About information before
              creating About cards.
            </p>

            <button
              type="button"
              onClick={openAddAboutForm}
              className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Add About
            </button>
          </div>
        )}
      </section>

      {/* =====================================================
          ABOUT CARDS
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              About Cards
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add feature cards with an icon name or
              direct image URL.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddCardForm}
            disabled={!about}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Add Card
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {cardsLoading ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : cards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Plus size={24} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No About cards
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Add cards such as Frontend Development,
                Backend Development, Web Applications,
                or any other information you want to
                highlight.
              </p>

              <button
                type="button"
                onClick={openAddCardForm}
                disabled={!about}
                className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={17} />
                Add First Card
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cards.map((card, index) => {
                const cardHasImage = isImageUrl(
                  card.icon
                );

                return (
                  <div
                    key={card.id}
                    className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm sm:flex-row sm:items-center"
                  >
                    {/* Order */}

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <GripVertical size={18} />
                      </div>

                      <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-blue-50 px-2 text-xs font-bold text-blue-600">
                        {card.display_order ||
                          index + 1}
                      </div>
                    </div>

                    {/* IMAGE */}

                    {cardHasImage ? (
                      <div className="shrink-0">
                        <div className="h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          <img
                            src={card.icon}
                            alt={card.title}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                        <ImageIcon size={24} />
                      </div>
                    )}

                    {/* Card content */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {card.title}
                        </h3>

                        {card.icon && !cardHasImage && (
                          <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                            {card.icon}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                        {card.description}
                      </p>

                      {cardHasImage && (
                        <p className="mt-2 truncate text-xs text-slate-400">
                          {card.icon}
                        </p>
                      )}
                    </div>

                    {/* Actions */}

                    <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
                      {cardHasImage && (
                        <a
                          href={card.icon}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          title="Open Image"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          openEditCardForm(card)
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        title="Edit Card"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCard(card)
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        title="Delete Card"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          MAIN ABOUT MODAL
      ====================================================== */}

      {showAboutForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Portfolio Content
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {editingAbout
                    ? "Edit About"
                    : "Add About"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeAboutForm}
                disabled={savingAbout}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleAboutSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              {/* Main heading */}

              <div>
                <label
                  htmlFor="about-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Main Heading
                </label>

                <input
                  id="about-title"
                  name="title"
                  type="text"
                  value={aboutForm.title}
                  onChange={handleAboutChange}
                  placeholder="e.g. Turning ideas into useful digital products."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Short description */}

              <div>
                <label
                  htmlFor="about-short-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Short Description
                </label>

                <textarea
                  id="about-short-description"
                  name="short_description"
                  value={
                    aboutForm.short_description
                  }
                  onChange={handleAboutChange}
                  rows={4}
                  placeholder="Write the main About introduction..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Detailed description */}

              <div>
                <label
                  htmlFor="about-long-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Detailed Description
                </label>

                <textarea
                  id="about-long-description"
                  name="long_description"
                  value={
                    aboutForm.long_description
                  }
                  onChange={handleAboutChange}
                  rows={7}
                  placeholder="Write the detailed About information..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Profile image */}

              <div>
                <label
                  htmlFor="about-profile-image"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Profile Image URL
                </label>

                <input
                  id="about-profile-image"
                  name="profile_image"
                  type="text"
                  value={
                    aboutForm.profile_image
                  }
                  onChange={handleAboutChange}
                  placeholder="https://example.com/profile.jpg"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                {aboutForm.profile_image &&
                  isImageUrl(
                    aboutForm.profile_image
                  ) && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium text-slate-500">
                        Image Preview
                      </p>

                      <ImagePreview
                        src={
                          aboutForm.profile_image
                        }
                        alt="Profile preview"
                        size="large"
                        rounded="rounded-2xl"
                      />
                    </div>
                  )}
              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAboutForm}
                  disabled={savingAbout}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingAbout}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  <Save size={17} />

                  {savingAbout
                    ? "Saving..."
                    : editingAbout
                    ? "Update About"
                    : "Add About"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          CARD MODAL
      ====================================================== */}

      {showCardForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  About Cards
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {editingCard
                    ? "Edit Card"
                    : "Add Card"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeCardForm}
                disabled={savingCard}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCardSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              {/* Card title */}

              <div>
                <label
                  htmlFor="card-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Card Title
                </label>

                <input
                  id="card-title"
                  name="title"
                  type="text"
                  value={cardForm.title}
                  onChange={handleCardChange}
                  placeholder="e.g. Frontend Development"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Card description */}

              <div>
                <label
                  htmlFor="card-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Card Description
                </label>

                <textarea
                  id="card-description"
                  name="description"
                  value={cardForm.description}
                  onChange={handleCardChange}
                  rows={5}
                  placeholder="Describe this skill or capability..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* ICON / IMAGE URL */}

              <div>
                <label
                  htmlFor="card-icon"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Icon / Image URL
                </label>

                <input
                  id="card-icon"
                  name="icon"
                  type="text"
                  value={cardForm.icon}
                  onChange={handleCardChange}
                  placeholder="https://example.com/image.png or Code2"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Enter a Lucide icon name such as{" "}
                  <span className="font-semibold">
                    Code2
                  </span>
                  , or paste a direct image URL.
                </p>

                {/* LIVE PREVIEW */}

                {cardForm.icon &&
                  isImageUrl(cardForm.icon) && (
                    <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <ImageIcon
                          size={16}
                          className="text-blue-600"
                        />

                        <span className="text-sm font-semibold text-slate-700">
                          Image Preview
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <ImagePreview
                          src={cardForm.icon}
                          alt={
                            cardForm.title ||
                            "Card image preview"
                          }
                          size="medium"
                          rounded="rounded-xl"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-slate-500">
                            The image above will be
                            displayed on the About
                            card.
                          </p>

                          <a
                            href={cardForm.icon}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink
                              size={13}
                            />
                            Open image
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Display order */}

              <div>
                <label
                  htmlFor="card-display-order"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Display Order
                </label>

                <input
                  id="card-display-order"
                  name="display_order"
                  type="number"
                  min="1"
                  value={cardForm.display_order}
                  onChange={handleCardChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCardForm}
                  disabled={savingCard}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingCard}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  <Save size={17} />

                  {savingCard
                    ? "Saving..."
                    : editingCard
                    ? "Update Card"
                    : "Add Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}