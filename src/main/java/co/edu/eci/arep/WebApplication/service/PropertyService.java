package co.edu.eci.arep.WebApplication.service;

import co.edu.eci.arep.WebApplication.model.Property;
import co.edu.eci.arep.WebApplication.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    public Property createProperty(Property property) {
        if (property.getPropertyId() != null && propertyRepository.existsById(property.getPropertyId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Property exists");
        }
        return propertyRepository.save(property);
    }

    public List<Property> getAllProperties() {
        if(propertyRepository.findAll() != null){
            return (List<Property>) propertyRepository.findAll();
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "There is no properties");
        }
    }

    public Property getPropertyById(Long id) {
        Property property = propertyRepository.findById(id).orElse(null);

        if(property != null){
            return property;
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found");
        }

    }

    public Property updateProperty(Long id, Property propertyNew) {
        Property property = propertyRepository.findById(id).orElse(null);
        if(property != null){
            property.setAddress(propertyNew.getAddress());
            property.setDescription(propertyNew.getDescription());
            property.setPrice(propertyNew.getPrice());
            property.setSize(propertyNew.getSize());
            return propertyRepository.save(property);
        }
        else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found");
        }
    }

    public void deleteProperty(Long id){
        Property property = propertyRepository.findById(id).orElse(null);

        if (property == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found");
        }
        else {
            propertyRepository.delete(property);
        }

    }
}
