import ListingCard from './ListingCard';

export default function ListingGrid({ listings, onImageChange }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          index={index}
          onImageChange={onImageChange}
        />
      ))}
    </div>
  );
}
