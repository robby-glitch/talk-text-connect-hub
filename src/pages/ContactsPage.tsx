
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Phone, 
  MessageSquare, 
  Search, 
  UserPlus, 
  Star, 
  MoreVertical,
  User,
} from "lucide-react";

type Contact = {
  id: string;
  name: string;
  number: string;
  email?: string;
  favorite: boolean;
};

const ContactsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data for demonstration
  const initialContacts: Contact[] = [
    { id: "1", name: "John Doe", number: "+1234567890", email: "john@example.com", favorite: true },
    { id: "2", name: "Jane Smith", number: "+1987654321", email: "jane@example.com", favorite: false },
    { id: "3", name: "Bob Johnson", number: "+1122334455", favorite: false },
    { id: "4", name: "Alice Williams", number: "+1567890123", email: "alice@example.com", favorite: true },
    { id: "5", name: "Charlie Brown", number: "+1654321789", favorite: false },
  ];
  
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.number.includes(searchQuery) ||
    (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const toggleFavorite = (id: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, favorite: !contact.favorite } : contact
    ));
  };
  
  const favorites = filteredContacts.filter(contact => contact.favorite);
  const others = filteredContacts.filter(contact => !contact.favorite);
  
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Contacts</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="pl-9"
          />
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>
      
      {favorites.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3 flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            Favorites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map(contact => (
              <ContactCard 
                key={contact.id}
                contact={contact}
                onToggleFavorite={() => toggleFavorite(contact.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-lg font-medium mb-3 flex items-center">
          <User className="h-4 w-4 mr-2" />
          All Contacts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {others.length === 0 ? (
            <p className="text-muted-foreground col-span-2 text-center py-4">
              {searchQuery ? "No contacts found matching your search" : "No contacts available"}
            </p>
          ) : (
            others.map(contact => (
              <ContactCard 
                key={contact.id}
                contact={contact}
                onToggleFavorite={() => toggleFavorite(contact.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

type ContactCardProps = {
  contact: Contact;
  onToggleFavorite: () => void;
};

const ContactCard = ({ contact, onToggleFavorite }: ContactCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mr-4">
            {contact.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{contact.name}</h3>
            <p className="text-sm text-muted-foreground">{contact.number}</p>
            {contact.email && (
              <p className="text-sm text-muted-foreground">{contact.email}</p>
            )}
          </div>
          <div className="flex space-x-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={onToggleFavorite}
              className={contact.favorite ? "text-yellow-500" : ""}
            >
              <Star size={18} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-primary"
            >
              <Phone size={18} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-primary"
            >
              <MessageSquare size={18} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
            >
              <MoreVertical size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsPage;
